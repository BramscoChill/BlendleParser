module.exports = (function () {
  const ByeBye = require('byebye');
  const i18n = require('instances/i18n');
  const formFieldTemplate = require('templates/forms/elements/field');

  const FormFieldView = ByeBye.View.extend({
    className: 'v-value-with-label',
    events: {
      'click :not(.l-edit)': '_eEdit',
      'click .lnk-edit': '_eEdit',
      'click .lnk-save': '_eSave',
      'click .lnk-cancel': '_eCancel',
    },

    initialize() {
      this._labelView = this.addView(
        new LabelView({
          label: this.options.label,
        }),
      );

      this._inputView = this.options.input;

      this._valueView = this.addView(
        new ValueView({
          value: this.options.value,
          valueToString: this.options.valueToString,
        }),
      );
    },

    render() {
      this.el.innerHTML = formFieldTemplate({
        i18n: i18n.locale,
      });

      this.el.querySelector('.label').appendChild(this._labelView.render().el);
      this.el.querySelector('.value').appendChild(this._valueView.render().el);
      this.el.querySelector('.value').appendChild(this._inputView.render().el);

      return this;
    },

    /**
     * Set the current value
     * @param {String} value
     * @param {String} [displayValue]
     */
    setValue(value, displayValue) {
      this._valueView.setValue(displayValue || value);
      this._inputView.setValue(value);
    },

    /**
     * Set the field to success state, after a second, return to edit state
     */
    setSuccess() {
      if (!this.el) return;

      this._unsetEditState();

      this.el.querySelector('.status').innerHTML = i18n.locale.form.field.status.changed;

      this.setState('success');

      setTimeout(() => {
        this.el.querySelector('.status').innerHTML = '';

        this.removeState('success');
      }, 1000);
    },

    /**
     * Set the field to error state, after a second, return to edit state
     */
    setError() {
      if (!this.el) return;

      this._unsetEditState();

      this.el.querySelector('.status').innerHTML = i18n.locale.form.field.status.error;

      this.setState('error');

      this._inputView.reset();

      setTimeout(() => {
        this.el.querySelector('.status').innerHTML = '';

        this.removeState('error');
      }, 1000);
    },

    /**
     * Set field to loading state
     */
    setLoading() {
      if (!this.el) return;

      this._unsetEditState();

      this.el.querySelector('.status').innerHTML = i18n.locale.form.field.status.loading;

      this.setState('loading');
    },

    _unsetEditState() {
      if (!this.el) return;

      this.removeEventListener(window, 'click');

      this.el.classList.remove('l-edit');
    },

    _eEdit(e) {
      e.preventDefault();

      this.el.classList.add('l-edit');

      this.addEventListener(window, 'click', this._eCancelEdit.bind(this));

      this.options.onEdit && this.options.onEdit(this._inputView.getValue());
    },

    _eCancelEdit(e) {
      if (!this.el.contains(e.target) && e.target !== this.el && document.body.contains(e.target)) {
        this._unsetEditState();
      }
    },

    _eSave(e) {
      e.preventDefault();

      this._unsetEditState();

      this.options.onSave && this.options.onSave(this._inputView.getValue());
    },

    _eCancel(e) {
      e.preventDefault();

      this._unsetEditState();

      this._inputView.reset();

      this.options.onCancel && this.options.onCancel(this._inputView.getValue());
    },
  });

  const LabelView = ByeBye.View.extend({
    className: 'v-label',

    events: {
      _eClick: '_eClick',
    },

    render() {
      this.el.innerHTML = this.options.label;

      return this;
    },

    _eClick(e) {
      e.preventDefault();

      this.options.onClick && this.options.onClick();
    },
  });

  const ValueView = ByeBye.View.extend({
    className: 'v-value',
    events: {
      _eClick: '_eClick',
    },

    initialize() {
      this._value = this.options.value;
    },

    render() {
      if (this.options.valueToString) {
        this.el.innerHTML = this.options.valueToString(this._value);
      } else {
        this.el.innerHTML = this._value;
      }

      return this;
    },

    /**
     * Set the current value
     * @param {String} value
     */
    setValue(value) {
      this._value = value;

      this.render();
    },

    /**
     * Get the current value
     * @return {String}
     */
    getValue() {
      return this._value;
    },

    _eClick(e) {
      e.preventDefault();

      this.options.onClick && this.options.onClick();
    },
  });

  return FormFieldView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/forms/elements/field.js