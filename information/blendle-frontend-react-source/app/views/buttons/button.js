module.exports = (function () {
  // Libraries
  const ByeBye = require('byebye');

  const ButtonView = ByeBye.View.extend({
    tagName: 'button',
    className: 'v-button btn',
    events: {
      click: '_onClick',
    },

    /**
     * Initialize the button view
     * @param  {Object} options Requires an onClick attribute, takes text, disabled, className and layout
     */
    initialize(options) {
      if (options.className) {
        this.el.setAttribute('class', this.options.className);
      }

      if (options.type) {
        this.el.setAttribute('type', this.options.type);
      }

      if (options.layout) {
        this.el.classList.add(`l-${this.options.layout}`);
      }

      if (options.text) {
        this.el.innerHTML = options.text;
      }

      this._disabled = options.disabled;

      if (this._disabled) {
        this.disable();
      }
    },

    /**
     * Set the current layout
     * @param {String} layout
     */
    setLayout(layout) {
      this.el.classList.add(`l-${layout}`);
    },

    /**
     * Disable the button and set layout to disabled
     */
    disable() {
      this._disabled = true;
      this.el.setAttribute('disabled', '');

      this.setState('inactive');
    },

    /**
     * Enabled the button and remove disabled layout
     */
    enable() {
      this._disabled = false;
      this.el.removeAttribute('disabled');

      this.removeState('inactive');
    },

    /**
     * Set the state of the textarea to success
     */
    setSuccess() {
      this.setState('success');
    },

    /**
     * Set the state of the textarea to error
     */
    setError() {
      this.setState('error');
    },

    /**
     * Set the state of the textarea to loading
     */
    setLoading() {
      this.setState('loading');
    },

    /**
     * Set the text of the button
     * @param {String} text
     */
    setText(text) {
      this.el.innerHTML = text;
    },

    _onClick(e) {
      if (!this._disabled) {
        this.options.onClick(e);
      }
    },
  });

  return ButtonView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/buttons/button.js