import SimpleFormView from 'views/helpers/simpleform';
import EmailFormElementView from 'views/forms/elements/email';
import FacebookConnectView from 'views/facebookconnect';
import Analytics from 'instances/analytics';
import Cookies from 'cookies-js';
import { parseQuery } from 'urijs';
import SignUpManager from 'managers/signup';
import AuthController from 'controllers/auth';
import { locale as i18n, translate } from 'instances/i18n';
import { keyCode, EMAIL_BLACKLISTED, USER_ID_TAKEN, EMAIL_EXISTS } from 'app-constants';
import { blurActiveElement } from 'helpers/activeElement';
import { isEmail } from 'helpers/validate';

export default SimpleFormView.extend({
  className: 'v-signup-form',

  events: {
    'submit form': '_eSubmit',
    'click .footer-content .cookies a': '_eTrackFooterCookies',
    'click .footer-content .terms a': '_eTrackFooterTerms',
    'click .resend a': '_eResendVerification',
    'click .error-message a': '_eOpenLogin',
    'click .login a': '_eOpenLogin',
  },

  _expressions: {
    email: /^.+$/,
  },

  _fieldViews: {},

  initialize() {
    this.addView(
      new FacebookConnectView({
        analyticsEvent: this.options.analyticsEvent || 'Deeplink',
        onConnect: this._facebookConnected.bind(this),
        onFail: this._facebookError.bind(this),
        text: i18n.deeplink.signup.facebook,
        className: this.options.facebookButtonClassName,
      }),
      'facebookConnect',
    );

    const autofocus = this.options.autofocus !== undefined ? this.options.autofocus : true;
    const urlParameters = parseQuery(window.location.search);
    const prefilledValue = urlParameters.email || '';

    this.addView(
      new EmailFormElementView({
        autoFocus: autofocus,
        placeholder: i18n.deeplink.signup.email,
        onKeyDown: this._eEmailKeyDown.bind(this),
        value: prefilledValue,
      }),
      'email',
    );

    this._formMode = 'signup';
    this.el.classList.add('m-signup');
  },

  render() {
    this.el.insertAdjacentHTML(
      'beforeend',
      this.options.template({
        i18n,
        rememberMe: Cookies.enabled,
        cookiesDisabled: !Cookies.enabled,
      }),
    );

    this.find('.facebook-btn').appendChild(this.getView('facebookConnect').render().el);

    this._submitEl = this.find('.form-field-submit');
    this._submitEl.parentNode.insertBefore(this.getView('email').render().el, this._submitEl);

    return this;
  },

  _setLoading(isLoading) {
    const button = this._submitEl.querySelector('button[type="submit"]');
    if (isLoading) {
      return button.classList.add('s-loading');
    }

    button.classList.remove('s-loading');
  },

  _getFormEmail() {
    return this.find('.inp-email');
  },

  _eEmailKeyDown(ev) {
    this._removeErrorField('email');

    // don't submit on enter, since there could be a e-mail suggestion which shouldnt be ignored.
    if (ev.keyCode === keyCode.RETURN) {
      const suggestView = this.getView('email').getView('suggestion');
      const suggestion = suggestView && suggestView.getSuggestion();

      if (suggestion) {
        ev.preventDefault();
      }
    }
  },

  _eSubmit(ev) {
    ev.preventDefault();

    this.validateFieldsAndShowErrors();

    // forces iOS to close the keyboard
    blurActiveElement();

    const itemId = this.options.manifest && this.options.manifest.id;
    const email = this._getFormEmail().value;

    if (this._validateFields() && isEmail(email)) {
      this._setLoading(true);
      this.options
        .onSignUp(email, itemId)
        .then(this._signupSuccess.bind(this), this._signupError.bind(this));
    } else {
      Analytics.track(`${this.options.analyticsEvent || 'Deeplink'} Form`, {
        event: email ? 'invalid_input' : 'invalid_input_empty',
      });

      this._drawErrorField('email', i18n.error.invalid_email);

      this.find('.btn-submit').classList.remove('s-loading');
    }
  },

  _signupSuccess(token) {
    this._setLoading(false);
    this._signUpToken = token;

    AuthController.loginWithToken(token);

    this.find('.btn-submit').classList.remove('s-loading');

    Analytics.track('Signup/Send Confirmation', {
      deeplink: true,
    });

    this.options.onSignupSuccess(token.get('user'));
  },

  _signupError(err) {
    this._setLoading(false);
    Analytics.track(`${this.options.analyticsEvent || 'Deeplink'} Form`, {
      event: 'signup_error',
      message: err.message,
    });

    const messages = {
      [EMAIL_BLACKLISTED]: translate('app.signup.blacklisted_email_warning'),
      [EMAIL_EXISTS]: translate('deeplink.signup.email_exists'),
      [USER_ID_TAKEN]: translate('deeplink.signup.email_exists'),
    };

    this._drawErrorField(
      'email',
      messages[err.type] || err.message,
      err.status === 422 || !!messages[err.type],
    );
  },

  _removeFacebookError() {
    const errorEl = this.el.querySelector('.v-facebook-connect .error-message');

    if (errorEl) {
      errorEl.parentNode.removeChild(errorEl);
    }
  },

  _drawFacebookError(message) {
    this._removeErrorField('email');

    const node = this.el.querySelector('.v-facebook-connect');

    const errorEl = document.createElement('div');
    errorEl.className = 'error-message visible';
    errorEl.innerHTML = message;

    node.appendChild(errorEl);
  },

  _facebookError(error) {
    Analytics.track('Deeplink Form', {
      event: 'signup_error_facebook',
      message: error.data.message,
    });

    if (error.status === 422) {
      this._drawFacebookError(i18n.deeplink.signup.email_exists);
    } else {
      this._drawFacebookError(i18n.app.error.error_default);
    }
  },

  _facebookConnected(facebookStatus) {
    if (this.options.onFacebookConnected) {
      this.options.onFacebookConnected(facebookStatus);
    }
  },

  _eResendVerification(ev) {
    ev.preventDefault();

    const user = this._signUpToken.get('user');
    const itemId = this.options.manifest && this.options.manifest.id;
    SignUpManager.resendEmailConfirmation(user, itemId)
      .then(() => {
        this.options.onResendVerification(user, itemId);
      })
      .catch(() => {});
  },

  _removeErrorField() {
    SimpleFormView.prototype._removeErrorField.apply(this, arguments);
    this._removeFacebookError();
  },

  _eOpenLogin(ev) {
    ev.preventDefault();
    this._removeErrorField('email');
    this.options.onShowLogin(this._getFormEmail().value);
  },

  _eTrackFooterCookies() {
    Analytics.track('Signup/Privacy', {
      deeplink: true,
    });
  },

  _eTrackFooterTerms() {
    Analytics.track('Signup/Open Terms and Conditions', {
      deeplink: true,
    });
  },
});



// WEBPACK FOOTER //
// ./src/js/app/views/forms/signup.js