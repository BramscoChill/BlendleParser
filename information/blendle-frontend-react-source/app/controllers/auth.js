import history from 'libs/byebye/history';
import { Events } from 'backbone';
import {
  INVALID_TOKEN,
  NO_TOKEN,
  AUTH_REQUIRED,
  MANUAL_LOGOUT,
  MISSING_PASSWORD,
  LAB_EXPERIMENTS,
} from 'app-constants';
import PremiumSubscriptionActions from 'actions/PremiumSubscriptionActions';
import TypedError from 'helpers/typederror';
import Environment from 'environment';
import ApplicationState from 'instances/application_state';
import Analytics from 'instances/analytics';
import AuthManager from 'managers/auth';
import Cookie from 'cookies-js';
import AuthActions from 'actions/AuthActions';
import ExperimentsActions from 'actions/ExperimentsActions';
import features from 'config/features';
import LabActions from 'actions/LabActions';
import { labExperimentEnabled } from 'selectors/labExperiments';

// The refresh token cookie name needs to change since it will conflict with the .blendle.com when
// signing in on approval.blendle.com or other subdomains. Adding the BUILD_ENV will fix this.
let tokenCookieName = 'refreshToken';
if (process.env.BUILD_ENV !== 'production' && process.env.BUILD_ENV) {
  tokenCookieName += `-${process.env.BUILD_ENV.substr(0, 5)}`;
}

const tokenCookieSettings = {
  secure: Environment.ssl,
  expires: 60 * 60 * 24 * 365, // 1 year
};

// on production set the cookie to .blendle.com, to allow access from subdomains
if (process.env.BUILD_ENV === 'production') {
  tokenCookieSettings.domain = '.blendle.com';
}

// stores session
let sessionToken = null;

/**
 * refresh token is a token that is stored in the users browser, and can be used
 * to acquire request tokens, which are needed to authenticate api calls.
 * @returns {String|Null}
 */
function getRefreshToken() {
  return Cookie.get(tokenCookieName);
}

/**
 * store session tokens
 * @param {Token}
 */
function storeSession(token) {
  sessionToken = token;

  const user = token.get('user');

  AuthActions.update(user);

  // Sync AB tests
  ExperimentsActions.syncExperiments(user);

  // Make sure the user is set in the Analytics instance as soon as possible
  Analytics.setUser(user);

  Cookie.set(tokenCookieName, token.get('refresh_token'), tokenCookieSettings);
  Cookie.expire(MANUAL_LOGOUT);
}

function resetSession() {
  sessionToken = null;

  const { expires, ...otherSettings } = tokenCookieSettings;
  Cookie.expire(tokenCookieName, {
    ...otherSettings,
  });
}

/**
 * Handle the Promise response
 * @param {Promise}
 * @returns {Promise}
 */
function handleFetchTokenPromise(promise) {
  return promise
    .then((token) => {
      storeSession(token);
      return token;
    })
    .then((token) => {
      LabActions.loadExperiments(token.get('user'));
      return token;
    })
    .then((token) => {
      // Fetch all current subscriptions
      const user = token.get('user');

      // Get the premium subscription
      PremiumSubscriptionActions.fetchLatestPremiumSubscription(
        user.getLatestPremiumSubscriptionUrl(),
      );

      return token;
    })
    .then((token) => {
      AuthController.trigger('login');
      return token;
    })
    .catch((err) => {
      if (err.type === INVALID_TOKEN) {
        resetSession();
      }
      throw err;
    });
}

const AuthController = Object.assign(
  {
    /**
   * Get a new JWT for the given refresh token, or the current session token as default
   * @param {String} [refreshToken]
   * @return {Promise}
   */
    renewJWT(refreshToken) {
      refreshToken = refreshToken || getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(new TypedError(NO_TOKEN));
      }

      return new Promise((resolve, reject) => {
        AuthManager.fetchToken(refreshToken)
          .then((token) => {
            storeSession(token);
            resolve(token);
          })
          .catch((err) => {
            if (err.status === 401 || err.status === 403 || err.status === 404) {
              return reject(new TypedError(INVALID_TOKEN, err.data.message, err));
            }
            throw err;
          });
      });
    },

    /**
   * Automatically login the user by the refresh token
   * @return {Promise}
   */
    autoLogin() {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        return Promise.reject(new TypedError(NO_TOKEN));
      }
      return handleFetchTokenPromise(AuthManager.fetchToken(refreshToken));
    },

    /**
   * Log in using email/username and password, returns a promise
   * containing token.
   * @param {Object} credentials { login, password } or { facebook_id, facebook_access_token, fb_auto_logged_in } or { email_token }
   * @return {Promise}
   */
    loginWithCredentials(credentials) {
      if (!credentials.email_token && !credentials.password && !credentials.facebook_id) {
        return Promise.reject(new TypedError(MISSING_PASSWORD));
      }

      return handleFetchTokenPromise(
        AuthManager.fetchTokenByCredentials(credentials),
      ).catch((err) => {
        if (err.status === 401 || err.status === 403 || err.status === 404) {
          throw new TypedError(INVALID_TOKEN, err.data.message, err);
        }
        throw err;
      });
    },

    /**
   * Login using a Token object, returns a promise containing a token.
   * @param {Token} token
   * @return {Promise}
   */
    loginWithToken(token) {
      const refreshToken = token.get('refresh_token');
      if (!refreshToken) {
        return Promise.reject(new TypedError(NO_TOKEN));
      }

      return handleFetchTokenPromise(Promise.resolve(token));
    },

    /**
   * Logout the user by revoking the refreshToken
   * @return {Promise}
   */
    logout() {
      if (!this.getToken()) {
        return Promise.reject(new TypedError(AUTH_REQUIRED, 'User is currently not logged in'));
      }

      Cookie.set(MANUAL_LOGOUT, Date.now(), {
        expires: 3600 * 24, // 1 day
        secure: Environment.ssl,
      });

      return AuthManager.revokeRefreshToken(this.getId(), getRefreshToken())
        .then(() => {
          resetSession();
          AuthController.trigger('logout');
        })
        .catch((err) => {
          // XHR will fail when the token is already removed. But this is OK, just clear the session.
          if ('status' in err) {
            resetSession();
            AuthController.trigger('logout');
            return Promise.resolve(true);
          }
          throw err;
        });
    },

    /**
   * reset session and trigger logout
   */
    resetSession() {
      resetSession();
      AuthController.trigger('logout');
    },

    /**
   * Get the current logged in user
   * @return {User|null}
   */
    getUser() {
      if (!this.getToken()) {
        return null;
      }
      return this.getToken().get('user');
    },

    /**
   * Get the ID of the current logged in user
   * @return {String|null} [description]
   */
    getId() {
      if (!this.getUser()) {
        return null;
      }
      return this.getUser().id;
    },

    /**
   * Shim the original getToken method
   * @return {Token|null}
   */
    getToken() {
      return sessionToken;
    },

    /**
   * Get time since manual logout
   * @return {Number} Seconds since manual logout
   */
    getSecondsSinceManualLogout() {
      const loggedOut = Cookie.get(MANUAL_LOGOUT);
      if (!loggedOut) {
        return -1;
      }

      return Math.round(Date.now() / 1000 - Number(loggedOut) / 1000);
    },

    /**
   * Fetch the current user from the server
   * @TODO remove this sugar method, it should be done on the User model
   * @return {Promise}
   */
    fetchUser() {
      if (!this.getUser()) {
        return Promise.reject(new TypedError(AUTH_REQUIRED, 'User is currently not logged in'));
      }
      return this.getUser()
        .fetch()
        .then(() => this.getUser());
    },

    /**
   * Find out if we need to shown the Signup flow for the user.
   * This can be when he hasn't completed the onboarding or isn't a user at all.
   * @TODO remove this method from the Auth controller, and add to AppController or something
   */
    requireSignup() {
      const user = this.getUser();
      return !user || (user && !user.didOnboarding());
    },

    /**
   * @TODO this shouldn't be in this controller, but in AppController or something
   */
    navigateToReturnURL() {
      const to = ApplicationState.get('requireAuthUrl') || '';
      if (history.fragment === to) {
        return history.loadUrl(to);
      }
      return history.navigate(to, { trigger: true, replace: true });
    },
  },
  Events,
);

export default AuthController;



// WEBPACK FOOTER //
// ./src/js/app/controllers/auth.js