module.exports = (function () {
  // Libraries
  const _ = require('lodash');
  const ByeBye = require('byebye');

  // Templates
  const template = require('templates/forms/elements/input');

  const InputFormElementView = ByeBye.View.extend({
    template,
    className: 'frm-field-wrapper',

    // Defaults
    type: 'text',
    name: 'defaultName',
    placeholder: 'placeholder',
    value: '',
    maxlength: '',
    autoFocus: false,
    autoComplete: true,
    classNames: [],
    keyUpChangeTimeout: 700,
    toLowerCase: false,

    _keyUpChangePrevValue: null, // Used to know if value actually changed on keyUp.

    // Mapping for inp-type className
    typeClassMapping: {
      text: 'text',
      email: 'text',
      file: 'file',
    },

    events: {
      'click input': '_eClick',
      'change input': '_eChange',
      'focus input': '_eFocus',
      'blur input': '_eBlur',
      'keyup input': '_eKeyUp',
      'keydown input': '_eKeyDown',
    },

    // Dummy functions
    _eClick() {},
    _eChange() {},
    _eFocus() {},
    _eBlur() {},
    _eKeyUp() {},
    _eKeyDown() {},

    initialize(options) {
      this.setup(options);
    },

    validate() {
      return true;
    },

    reset() {
      this.resetKeyUpChange();
    },

    transformValue(value) {
      if (this.toLowerCase) {
        value = value.toLowerCase();
      }

      return value;
    },

    getValue() {
      if (!this.dom) {
        return;
      }
      return this.transformValue(this.dom.input.value);
    },

    setValue(value) {
      if (!this.dom) {
        return;
      }
      this.dom.input.value = this.transformValue(value);
    },

    setup(options) {
      this.options = _.defaults(options, {
        type: this.type,
        name: this.name,
        placeholder: this.placeholder,
        value: this.value,
        maxlength: this.maxlength,
        autoFocus: this.autoFocus,
        autoComplete: this.autoComplete,
        classNames: this.classNames,
        keyUpChangeTimeout: this.keyUpChangeTimeout,
      });
    },

    _setupKeyUpChange(timeout) {
      const lazyHasChanged = _.debounce(this._keyUpHasChanged.bind(this), timeout);

      // Set initial 'previous value' so we can check if it actually changed
      // without having to wait for the real change event.
      this._keyUpChangePrevValue = this.getValue();

      this.dom.input.addEventListener('keyup', lazyHasChanged, false);
    },

    _keyUpHasChanged(e) {
      if (!this.dom) return;

      const value = this.getValue();

      if (value !== this._keyUpChangePrevValue) {
        e.preventDefault();

        this._keyUpChangePrevValue = value;
        this.setValue(value);

        this._eChange(e);
      }
    },

    resetKeyUpChange() {
      this._keyUpChangePrevValue = null;
    },

    setClassNames() {
      const self = this;
      const classNames = this.options.classNames || [];

      classNames.push(`inp-${this.typeClassMapping[this.options.type]}` || this.options.type);
      classNames.push(`inp-${this.options.name}`);

      if (this.toLowerCase) {
        classNames.push('lowercase');
      }

      _.each(classNames, (className) => {
        self.dom.input.classList.add(className);
      });
    },

    setAttributes() {
      if (!this.dom.input) {
        return;
      }

      if (this.options.autocapitalize === false) {
        this.dom.input.setAttribute('autocapitalize', 'off');
      }
      if (this.options.autocomplete === false) {
        this.dom.input.setAttribute('autocomplete', 'off');
      }
      if (this.options.autoFocus === true) {
        this.dom.input.setAttribute('autofocus', 'true');
      }
      if (this.options.autocorrect === false) {
        this.dom.input.setAttribute('autocorrect', 'off');
      }
      if (this.options.disabled === true) {
        this.dom.input.setAttribute('disabled', 'disabled');
      } else {
        this.dom.input.removeAttribute('disabled');
      }

      if (
        this.options.autofocus &&
        !(window.BrowserDetect.browser === 'Explorer' && window.BrowserDetect.version <= 11)
      ) {
        this.dom.input.setAttribute('autofocus', true);
      }
    },

    setError(err) {
      this.resetError();

      const errorEl = document.createElement('div');
      errorEl.className = 'error-message visible';
      errorEl.innerHTML = err;

      this.dom.input.parentNode.appendChild(errorEl);
      this.dom.error = errorEl;
    },

    resetError() {
      if (!this.dom.error) {
        return;
      }

      this.dom.error.parentNode.removeChild(this.dom.error);
      this.dom.error = null;
    },

    setDisabled(disabled) {
      this.options.disabled = disabled;
      this.setAttributes();
    },

    render() {
      this.el.innerHTML = this.template(this.options);

      this.dom.input = this.el.querySelector('input');

      this.setClassNames();

      this.setAttributes();

      // Disable keyUpChange by setting timeout to 0.
      if (this.options.keyUpChangeTimeout) {
        this._setupKeyUpChange(this.options.keyUpChangeTimeout);
      }

      return this;
    },
  });

  return InputFormElementView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/forms/elements/input.js