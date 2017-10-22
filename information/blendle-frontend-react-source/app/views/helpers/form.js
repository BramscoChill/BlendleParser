module.exports = (function () {
  // Libraries
  const ByeBye = require('byebye');
  const _ = require('lodash');
  const Q = require('q');

  const passwordStrength = require('helpers/passwordstrength');
  const i18n = require('instances/i18n').locale;
  const i18nTranslate = require('instances/i18n').translate;

  const FormView = ByeBye.View.extend({
    defaultClassName: 'v-form',

    errorClass: 's-error',
    validatedClass: 's-validated',

    fields: {},
    fieldNames: {},
    fieldErrors: {},
    drawErrorFields: true,
    validators: {},

    defaultEvents: {
      'submit form': '_ePreventDefault',
      'click .btn-submit.s-inactive': '_ePreventDefault',
      'submit form:not(.s-inactive):not(.s-loading)': '_eSubmit',
      'click .btn-submit:not(.s-inactive):not(.s-loading)': '_eSubmit',
      'keypress form': '_eSubmitOnKeyPress',
      'focusin .inp': '_eInputFocus',
      'focusout .inp': '_eInputChange',
      'change .inp': '_eInputChange',
    },

    constructor() {
      // Combine defaultEvents with parameter events. Latter overrides former.
      this.applyDefaultEvents();

      this.listenTo(this, 'validationError', this._eValidationError);
      this.listenTo(this, 'validated', this._eValidated);

      ByeBye.View.apply(this, arguments);
    },

    // Find the model key for an input name (reverse mapping of this.fields)
    getModelKey(name) {
      for (const modelKey in this.fields) {
        if (this.fields[modelKey] === name) {
          return modelKey;
        }
      }
    },

    afterUnload() {
      ByeBye.View.prototype.afterUnload.apply(this, arguments);
    },

    getValue(target) {
      if (!target) {
        return undefined;
      }

      // Unchecked radios/checkboxes are the only elements to return false.
      if (this.isCheckboxOrRadio(target)) {
        return this.getCheckboxValue(target);
      }
      return target.value;
    },

    isCheckboxOrRadio(target) {
      return (
        target.getAttribute('type') &&
        target
          .getAttribute('type')
          .toLowerCase()
          .match(/radio|checkbox/)
      );
    },

    // Collect all inputs with the same name and get the value
    // of the checked one (if any).
    getCheckboxValue(target) {
      let inpName = target.getAttribute('name'),
        value = false;

      _.each(this.el.querySelectorAll(`.inp[name=${inpName}]`), (node) => {
        value = node.checked ? node.value : value;
      });

      return value;
    },

    // All the same as checkboxes
    getRadioValue(target) {
      return this.getCheckboxValue(target);
    },

    isValid(modelKeys) {
      const validPromise = Q.defer(),
        validators = [];

      // Check model validation, and validators we might have ourself.
      for (let i = 0; i < modelKeys.length; i++) {
        const key = modelKeys[i];

        if (!this.model.isValid([key])) {
          validPromise.reject(new Error('Unable to validate form'));
        } else if (this.validators[key]) {
          const validator = this.validators[key].call(this, this.model.get(key));

          Q.when(validator).catch(validPromise.reject);

          validators.push(validator);
        }
      }

      Promise.all(validators).then(validPromise.resolve);

      return validPromise.promise;
    },
    validateInput(target) {
      const errorMessages = {};
      let modelKey;
      let value;
      let name;

      if (!target) {
        return;
      }

      // Instant Model set and validate. Can only work
      // if we have fields defined.
      if (this.fields) {
        value = this.getValue(target);
        name = target.getAttribute('name');

        modelKey = this.getModelKey(name);

        // If there's no modelKey we cannot validate
        if (!modelKey) {
          this.isComplete();

          return;
        }

        // Set and validate
        if (this.model.get(modelKey) !== value) {
          this.model.set(modelKey, value);
        }

        this.isValid([modelKey])
          .then(
            // Success
            this._removeError.bind(this, target),
            // Failure
            (errorMessage) => {
              this.model.validStates[modelKey] = false;

              target.classList.remove(this.validatedClass);
              target.classList.add(this.errorClass);

              if (this.drawErrorFields) {
                if (modelKey === 'password') {
                  _.extend(errorMessages, { password: this._getPasswordStrengthError(value) });
                } else if (errorMessage) {
                  _.extend(errorMessages, errorMessage);
                }
                this._drawErrorFields([name], errorMessages);
              }
            },
          )
          .fin(() => {
            this.isComplete();
          });
      }
    },

    _getPasswordStrengthError(password) {
      let error = i18n.app.error.default_form_field_validation;
      if (passwordStrength.getScore(password) === passwordStrength.SHORT) {
        error = i18n.error.password_too_short;
      }

      return error;
    },

    // When focussing, only remove any error that might be drawn.
    _eInputFocus(e) {
      this._removeError(e.delegateTarget);
    },
    // Change is also called on blur (focusout), since blurring without changing
    // the value does not trigger a change, but does require re-validation.
    // Don't validate empty fields though.
    _eInputChange(e) {
      const target = e.delegateTarget;

      if (!target || !this.getValue(target)) {
        return;
      }

      this.validateInput(target);
    },
    _removeError(target) {
      // Remove any errors this field might have had.
      target.classList.remove(this.errorClass);
      target.classList.add(this.validatedClass);

      if (this.drawErrorFields) {
        this._removeErrorField(name);
      }

      // Clear error state from view if there is no errorClass left.
      if (this.el && !this.el.querySelector(`.${this.errorClass}`)) {
        this.removeState('error');
      }
    },
    _ePreventDefault(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    _eSubmitOnKeyPress(e) {
      const target = e.delegateTarget;

      // Enter submits the form (except for textareas)
      if (target.tagName !== 'TEXTAREA' && (e.which === 10 || e.which === 13)) {
        this._eSubmit(e);
        return false;
      }

      return true;
    },
    _eSubmit(e) {
      let target = e.delegateTarget,
        btn;

      e.preventDefault();

      // Set loading state to submit button (if we can find it).
      if (target.classList.contains('btn')) {
        btn = target;
      } else if (target.tagName === 'FORM') {
        btn = target.querySelector('.btn-submit');
      }

      if (btn) {
        btn.classList.add('s-loading');
      }

      this.removeState('error');
      this.parseForm();
    },

    _eValidated() {},

    _eValidationError(fields) {
      if (this.drawErrorFields) {
        this._drawErrorFields(fields);
      }

      const loadingBtn = this.el.querySelector('.btn.s-loading');
      if (loadingBtn) {
        loadingBtn.classList.remove('s-loading');
      }

      this.setState('error');
    },

    fillForm(data) {
      let node,
        nodeToCheck;

      data = data || this.model.attributes;

      for (const k in data) {
        node = this.el.querySelector(`.inp[name=${k}]`);

        if (
          node
            .getAttribute('type')
            .toLowerCase()
            .match(/radio|checkbox/)
        ) {
          // Find node with this value and check it.
          nodeToCheck = this.el.querySelector(`.inp[name=${k}][value=${data[k]}]`);
          if (nodeToCheck) {
            nodeToCheck.setAttribute('checked', 'checked');
          }
        } else {
          node.value = data[k];
        }
      }
    },

    parseForm(fields) {
      const self = this;

      // Parse a specific set of fields, or use the defaults/all.
      fields = fields || this.fields;

      // First set all values.
      for (const k in fields) {
        const fieldName = fields[k];

        const node = this.el.querySelector(`.inp[name=${fieldName}]`);

        if (node) {
          const v = this.getValue(node);
          this.model.set(k, v);
        }
      }

      // Next up is validation. Default is autoValidate.
      if (!this.options || this.options.validate !== false) {
        this.isValid(Object.keys(fields)).then(
          () => {
            self.trigger('validated');
          },
          () => {
            // Get invalid attributes
            let invalidKeys = self.model.invalidAttributes(fields),
              invalidFieldName,
              invalidFieldNames = [];

            for (const k in invalidKeys) {
              invalidFieldName = fields[invalidKeys[k]];
              invalidFieldNames.push(invalidFieldName);

              const invalidNode = self.el.querySelector(`.inp[name=${invalidFieldName}]`);
              if (invalidNode) {
                invalidNode.classList.add(self.errorClass);
                invalidNode.classList.remove(self.validatedClass);

                self._drawErrorFields([invalidFieldName]);
              }
            }

            self.trigger('validationError', invalidFieldNames);
          },
        );
      }
    },

    _drawErrorFields(fields, errorMessages) {
      const errors = {};

      // First determine what type of error (required/empty or validation) and error message to use.
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const fieldName = this.fieldNames[field] ? this.fieldNames[field]() : null;

        // If a predefined errorMessage is given, we're done.
        if (errorMessages && errorMessages[field]) {
          errors[field] = errorMessages[field];

          continue; // Next field
        }

        // Required but empty?
        if (
          this.model.required &&
          this.model.required[field] &&
          !this.model.get(this.getModelKey(field))
        ) {
          // Use named or general error message.
          if (this.fieldErrors[field] && this.fieldErrors[field].required) {
            errors[field] = this.fieldErrors[field].required;
          } else if (fieldName) {
            errors[field] = i18nTranslate(
              'app.error.named_form_field_required',
              fieldName.toLowerCase(),
            );
          } else if (this.className.indexOf('pane refund') !== -1) {
            errors[field] = i18n.refund.no_reason;
          } else {
            errors[field] = i18n.app.error.default_form_field_required;
          }

          continue; // Next field
        }

        // validationError is all that's left
        if (this.fieldErrors[field] && this.fieldErrors[field].validation) {
          errors[field] = this.fieldErrors[field].validation();
        } else if (fieldName) {
          errors[field] = i18nTranslate(
            'app.error.named_form_field_validation',
            _.capitalize(fieldName),
          );
        } else {
          errors[field] = i18n.app.error.default_form_field_validation;
        }
      }

      for (const k in errors) {
        this._drawErrorField(k, errors[k]);
      }
    },

    // Adds an error-message div to the parent of the field. It is the presentation-layer's responsibility
    // to position the errors (and therefor perhaps provide fitting parent elements).
    _drawErrorField(field, message, setHTML = false) {
      const node = this.el.querySelector(`.inp[name=${field}]`);

      // Remove old error message
      this._removeErrorField(field);

      const errorEl = document.createElement('div');
      errorEl.setAttribute('data-field', field);
      errorEl.className = 'error-message';

      if (setHTML) {
        errorEl.innerHTML = message;
      } else {
        errorEl.textContent = message;
      }

      node.parentNode.appendChild(errorEl);

      setTimeout(() => {
        errorEl.classList.add('visible');
      });
    },

    _removeErrorField(field) {
      if (field) {
        const node = this.el.querySelector(`.error-message[data-field=${field}]`);
        if (node) {
          node.parentNode.removeChild(node);
        }
      } else {
        return this._removeAllErrorFields();
      }
    },

    _removeAllErrorFields() {
      if (this.el) {
        _.each(this.el.querySelectorAll('.error-message'), (node) => {
          node.parentNode.removeChild(node);
        });
      }
    },

    // Check if all required fields validate.
    isComplete() {
      let complete = true;
      let node;

      if (this.model) {
        for (const k in this.model.required) {
          // Required key could still be set to false.
          if (this.model.required[k]) {
            node = this.el.querySelector(`.inp[name=${this.fields[k]}]`);
            if (
              node &&
              (!this.getValue(node) || this.model.invalidAttributes().indexOf(k) !== -1)
            ) {
              complete = false;
              break;
            }
          }
        }
      }

      if (complete) {
        this.trigger('formComplete');
      } else {
        this.trigger('formIncomplete');
      }

      return complete;
    },

    enableSubmitButton(selector) {
      selector = typeof selector === 'string' ? selector : null;
      const btn = this.el.querySelector(selector || '.btn-submit');
      if (btn) {
        btn.classList.remove('s-inactive');
      }
    },

    disableSubmitButton(selector) {
      selector = typeof selector === 'string' ? selector : null;
      const btn = this.el.querySelector(selector || '.btn-submit');
      if (btn) {
        btn.classList.add('s-inactive');
      }
    },
  });

  return FormView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/helpers/form.js