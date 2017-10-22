module.exports = (function () {
  const ByeBye = require('byebye');
  const Analytics = require('instances/analytics');
  const i18n = require('instances/i18n').locale;
  const UsersManager = require('managers/users');
  const Input = require('views/forms/elements/input');
  const Button = require('views/buttons/button');
  const resetTokenFormTemplate = require('templates/forms/resettoken');
  const isEmail = require('helpers/validate').isEmail;

  const ApplicationState = require('instances/application_state');

  const ResetTokenFormView = ByeBye.View.extend({
    className: 'v-reset-token-form',
    events: {
      'submit form': '_eSubmit',
      'click .lnk-reset-token': '_eBack',
    },

    initialize() {
      this._email = this.addView(
        new Input({
          type: 'email',
          name: 'email',
          value: '',
          placeholder: i18n.login.dropdown.reset.email,
          className: 'frm-field-wrapper error-left',
          autoFocus: true,
        }),
        'email',
      );

      this._submit = this.addView(
        new Button({
          type: 'submit',
          text: i18n.login.dropdown.reset.submit,
          onClick: this._eSubmit.bind(this),
        }),
        'submit',
      );
    },

    render() {
      this.el.innerHTML = resetTokenFormTemplate({
        i18n,
      });

      this.dom.form = this.el.querySelector('.reset-token-form');

      this.dom.success = this.el.querySelector('.reset-token-success');

      this.el.removeChild(this.dom.success);

      const form = this.dom.form.querySelector('form');

      form.appendChild(this.getView('email').render().el);
      form.appendChild(this.getView('submit').render().el);

      return this;
    },

    reset() {
      this._toggleForm(true);
      this._email.resetError();
    },

    setDisabled(disabled) {
      const input = this.getView('email');
      input.setDisabled(disabled);
    },

    /**
     * validate the email input
     * @returns {boolean}
     * @private
     */
    _validateEmail() {
      this._email.resetError();

      if (this._email.getValue().trim().length === 0) {
        this._email.setError(i18n.app.error.default_form_field_required);
        return false;
      }

      if (!isEmail(this._email.getValue())) {
        this._email.setError(i18n.error.invalid_email);
        return false;
      }

      return true;
    },

    /**
     * toggle the success/form pane
     * @param toggle
     * @private
     */
    _toggleForm(toggle) {
      if (toggle) {
        this.el.appendChild(this.dom.form);
        this.el.removeChild(this.dom.success);
      } else {
        this.el.removeChild(this.dom.form);
        this.el.appendChild(this.dom.success);
      }
    },

    /**
     * try and request a new token
     * @private
     */
    _requestToken() {
      const self = this;

      this._submit.setState('loading');

      Analytics.track('Request Password Reset');

      UsersManager.requestResetToken(this._email.getValue())
        .then(
          () => {
            Analytics.track('Request Password Reset Send');
            self._toggleForm(false);

            ApplicationState.saveToCookie();
          },
          (err) => {
            Analytics.track('Request Password Failed');

            if (err.status === 404) {
              self._email.setError(i18n.login.reset_token_not_found);
            } else {
              self._email.setError(i18n.login.reset_token_fail);
            }
          },
        )
        .fin(() => {
          self._submit.resetState();
        });
    },

    /**
     * handle the form submit
     * @param {Event} ev
     * @private
     */
    _eSubmit(ev) {
      ev.preventDefault();

      this._email.el.blur();

      if (this._validateEmail()) {
        this._requestToken();
      }
    },

    /**
     * handle click on back button
     */
    _eBack() {
      this.options.back();
    },

    focus() {
      if (this._email && this._email.el.querySelector('input')) {
        this._email.el.querySelector('input').focus();
      }
    },
  });

  return ResetTokenFormView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/forms/resettoken.js