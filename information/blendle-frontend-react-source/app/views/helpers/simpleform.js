module.exports = (function () {
  /**
   * Module dependencies.
   */

  // Libraries
  const _ = require('lodash');
  const ByeBye = require('byebye');

  /**
   * Initialize 'SimpleFormView'.
   *
   * @return {ByeByeView}
   * @api public
   */
  const SimpleFormView = ByeBye.View.extend({
    defaultClassName: 'v-form',
    _expressions: {},

    /**
     * Validate a single 'field', and show errors if any are found.
     *
     * @param {String[]} fields
     * @api public
     */
    validateFieldsAndShowErrors(fields) {
      _.each(fields || this.el.querySelectorAll('.inp-text'), (field) => {
        this.validateFieldAndShowError(field);
      });
    },

    /**
     * Validate an array of 'field's, and show errors if any are found.
     * TODO: Move string to i18n
     *
     * @param {String} field
     * @api public
     */
    validateFieldAndShowError(field) {
      const fieldName = field.getAttribute('name');

      if (!this._validateField(field)) {
        this._drawErrorField(fieldName, 'Wil je hier iets invullen?');
      } else {
        this._removeErrorField(fieldName);
      }
    },

    /**
     * The logic to validate an array of 'field's
     * for 'validateFieldsandShowError()'.
     *
     * @api private
     * @return {Boolean}
     */
    _validateFields() {
      const fields = this.el.querySelectorAll('.inp-text');
      const validated = _.map(fields, this._validateField.bind(this));

      if (_.every(validated)) {
        return true;
      }
      return false;
    },

    /**
     * The logic to validate an single 'field'
     * for 'validateFieldandShowError()'.
     *
     * @param {String} field
     * @api private
     * @return {Boolean}
     */
    _validateField(field) {
      const fieldName = field.getAttribute('name');
      const expression = this._expressions[fieldName];

      if (expression) {
        const regExp = new RegExp(this._expressions[fieldName]);

        if (regExp.test(field.value)) {
          return true;
        }
        return false;
      }
    },

    /**
     * Draw an error 'field'.
     *
     * @param {String} field
     * @param {String} message
     * @param {Boolean} [setHTML=false]
     * @api private
     */
    _drawErrorField(field, message, setHTML = false) {
      const node = this.el.querySelector(`.inp[name=${field}]`);

      // Remove old error message.
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

    /**
     * Remove an error 'field'.
     *
     * @param {String} field
     * @api private
     */
    _removeErrorField(field) {
      let selector = '.error-message';
      if (field) {
        selector += `[data-field=${field}]`;
      }
      const node = this.el.querySelector(selector);

      if (node) {
        node.parentNode.removeChild(node);
      }
    },
  });

  return SimpleFormView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/helpers/simpleform.js