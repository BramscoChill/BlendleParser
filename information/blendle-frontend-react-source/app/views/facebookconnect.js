module.exports = (function () {
  const ByeBye = require('byebye');
  const _ = require('lodash');
  const Auth = require('controllers/auth');
  const Country = require('instances/country');
  const Analytics = require('instances/analytics');
  const Facebook = require('instances/facebook');
  const FacebookManager = require('managers/facebook');
  const SignUpManager = require('managers/signup');
  const FacebookSignUpModel = require('models/facebooksignup');
  const i18n = require('instances/i18n').locale;
  const i18nTranslate = require('instances/i18n').translate;
  const template = require('templates/views/facebookconnect.jade');
  const constants = require('app-constants');
  const TypedError = require('helpers/typederror');

  const FacebookConnectView = ByeBye.View.extend({
    className: 'pane v-facebook-connect connect',

    events: {
      'click .lnk-not-you': '_eFacebookLogout',
      'click .btn-facebook': '_eFacebookConnect',
    },

    initialize() {
      this.options = _.defaults(this.options, {
        text: i18n.app.buttons.connect_to_facebook,
      });

      this._onFail = this.options.onFail;
      this._onConnect = this.options.onConnect;

      Facebook.load().catch((err) => {
        if (err.type !== constants.LIBRARY_UNAVAILABLE) {
          throw err;
        }
      });
    },

    render() {
      this.delegateEvents();

      this.el.innerHTML = template({
        i18n,
        text: this.options.text,
      });

      this.dom = {
        button: this.el.querySelector('.btn-facebook'),
        promise: this.el.querySelector('.fb-promise'),
        not_you: this.el.querySelector('.lnk-not-you'),
      };

      Facebook.load()
        .then(this._facebookLoad.bind(this))
        .catch(this._facebookFail.bind(this));

      Facebook.loggedIn().catch((err) => {
        if (err.type === 'UnableToLogin' || err.type === constants.LIBRARY_UNAVAILABLE) {
          return;
        }
        throw err;
      });

      this.display();

      return this;
    },

    _facebookLoad() {
      this.dom.button.classList.remove('s-inactive');

      Facebook.getMe()
        .then(this._addFacebookIdentity.bind(this))
        .catch(this._facebookDone.bind(this));

      this.trigger('load');
    },

    _facebookFail(err) {
      if (!this.dom) {
        return;
      }

      this.dom.button.textContent = i18n.app.error.facebook_unavailable;
      this.dom.promise.textContent = i18n.app.error.facebook_unavailable_hint;

      this._facebookDone();

      this.trigger('fail');
    },

    _facebookDone(err) {
      if (!this.dom) {
        return;
      }

      this.dom.button.classList.remove('s-loading');

      if (err && err.type === constants.LIBRARY_UNAVAILABLE) {
        this._facebookFail(err);
      }
    },

    _addFacebookIdentity(me) {
      this.dom.button.innerHTML = i18nTranslate('app.buttons.continue_as', me.first_name);
      this.dom.not_you.classList.remove('s-inactive');

      this._facebookDone();
    },

    _removeFacebookIdentity() {
      this.dom.button.textContent = this.options.text;
      this.dom.not_you.classList.add('s-inactive');
    },

    _addConnectedMessage() {
      if (this.dom && this.options && this.options.showConnected !== false) {
        this.dom.button.textContent = i18n.app.buttons.connected;
      }
    },

    _eFacebookConnect() {
      const btn = this.dom.button;

      if (
        btn.classList.contains('s-inactive') ||
        btn.classList.contains('s-loading') ||
        btn.classList.contains('redirect')
      ) {
        return;
      }

      btn.classList.add('s-loading');

      if (typeof this.options.onClick === 'function') {
        this.options.onClick();
      }

      FacebookManager.login().then(
        this._facebookLoginSuccess.bind(this),
        this._facebookLoginFailure.bind(this),
      );
    },

    _facebookLoginSuccess() {
      this._addConnectedMessage();
      this._onConnect('signIn');
      this.trigger('connect');
    },

    _facebookLoginFailure(resp) {
      // Dialog has been closed.
      if (!resp.status || resp.status === 'unknown') {
        this._facebookDone();
        return;
      }

      const onFail = (err) => {
        this._onFail && this._onFail(err);
        this._facebookDone();
      };

      if (resp.status === 'authorized_new_user') {
        this._facebookAuthorizedNewUser(
          resp.authResponse.userID,
          resp.authResponse.accessToken,
        ).then((facebookUser) => {
          this._onConnect('signUp', facebookUser);
          this.trigger('connect');
        }, onFail);

        return;
      }

      onFail(new TypedError(constants.FACEBOOK_FAILURE, 'Unable to process login', resp));
    },

    _facebookAuthorizedNewUser(facebookId, accessToken) {
      const fbUser = new FacebookSignUpModel({
        facebook_id: facebookId,
        facebook_access_token: accessToken,
        country: Country.getCountryCode(),
        ...this.options.signUpContext,
      });

      return SignUpManager.signup(fbUser, this.options.signUpType)
        .then(token => Auth.loginWithToken(token))
        .then(token => token.get('user'));
    },

    _eFacebookLogout() {
      const self = this;

      if (
        this.dom.button.classList.contains('s-inactive') ||
        this.dom.button.classList.contains('s-loading')
      ) {
        return;
      }

      this.dom.button.classList.add('s-loading');

      Facebook.logout().then(() => {
        self._removeFacebookIdentity();

        self.dom.button.classList.remove('s-loading');

        self.trigger('logout');
      });
    },
  });

  return FacebookConnectView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/facebookconnect.js