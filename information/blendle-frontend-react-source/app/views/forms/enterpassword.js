module.exports = (function () {
  const ByeBye = require('byebye');
  const AuthManager = require('managers/auth');
  const Auth = require('controllers/auth');
  const i18n = require('instances/i18n').locale;
  const enterPasswordTemplate = require('templates/forms/enterpassword');

  const EnterPasswordForm = ByeBye.View.extend({
    className: 'enter-password-form',

    events: {
      'submit .frm': '_eSubmit',
      'click .btn-submit': '_eSubmit',
      'click .btn-request-reset': '_eRequestReset',
    },

    _eSubmit(e) {
      const self = this;

      e.preventDefault();

      const inp = this.el.querySelector('.inp-password');

      if (inp.value === undefined || inp.value === '') {
        inp.classList.add('s-error');
        return;
      }
      inp.classList.remove('s-error');

      // Make sure we submit just once
      if (this._submitted) {
        return;
      }
      this._submitted = true;

      // We are loading
      this.el.querySelector('.btn-submit').classList.add('s-loading');

      // Validate the password with the server
      AuthManager.fetchTokenByCredentials({ login: Auth.getId(), password: inp.value }).then(
        () => {
          self.options.callback && self.options.callback(inp.value);
        },
        () => {
          if (self.el) {
            inp.classList.add('s-error');

            self.el.querySelector('.btn-submit').classList.remove('s-loading');
            self._submitted = false;

            self.el.querySelector('.inp-password').value = '';
            self.el.querySelector('.inp-password').focus();
          }
        },
      );
    },

    _eRequestReset(e) {
      e.preventDefault();

      this.options.requestReset();
    },

    render() {
      const self = this;

      this.el.innerHTML = enterPasswordTemplate({
        i18n,
        inputClass: this.options.accessDenied ? 's-error' : '',
      });

      setTimeout(() => {
        if (self.el) {
          self.el.querySelector('.inp-password').focus();
        }
      }, 400);

      this.display();

      return this;
    },

    unload() {
      ByeBye.View.prototype.unload.apply(this, arguments);
    },
  });

  return EnterPasswordForm;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/forms/enterpassword.js