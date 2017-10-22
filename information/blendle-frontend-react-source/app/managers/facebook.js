import ByeBye from 'byebye';
import Facebook from 'instances/facebook';
import Auth from 'controllers/auth';
import UsersManager from 'managers/users';
import Settings from 'controllers/settings';
import Users from 'collections/users';
import Cookies from 'cookies-js';
import { MANUAL_LOGOUT } from 'app-constants';
import TypedError from 'helpers/typederror';

const FacebookManager = {
  /**
   * Define different statuscodes to catch and process
   * @type {Object}
   */
  statusCodes: {
    200: 'authorized',
    401: 'unauthorized',
    403: 'authorized_new_user',
    429: 'throttled',
  },

  /**
   * Log the current user in with Facebook. Assume Facebook lib is loaded successfully.
   *
   * @param {Object} [authResponse] Must contain at least userID and accessToken.
   * @return {Promise}
   */
  login(authResponse) {
    authResponse = authResponse || Facebook.getAuthResponse();

    if (authResponse) {
      return this._processAuthResponse(authResponse);
    }

    return Facebook.login().then(response => this._processAuthResponse(response.authResponse));
  },

  authorize(user) {
    return new Promise((resolve, reject) => {
      if (Facebook.getAuthResponse()) {
        return resolve(Facebook.getAuthResponse());
      }

      Facebook.login()
        .then(resolve)
        .catch(reject);
    }).then((resp) => {
      const authResponse = resp.authResponse || resp;

      return UsersManager.saveFacebookCredentials(user, authResponse);
    });
  },

  getFriends(user) {
    return Facebook.getFriendIDs()
      .then(facebook_friends =>
        ByeBye.ajax({
          url: Settings.getLink('follows', { user_id: user.id }),
          type: 'POST',
          data: JSON.stringify({ facebook_friends }),
        }),
      )
      .then(resp => Promise.resolve(new Users(resp.data, { parse: true })));
  },

  loginIfAuthorized() {
    // If the user has manually logged out, we should not automatically log them in again
    if (Cookies.get(MANUAL_LOGOUT)) {
      return Promise.reject(new TypedError(MANUAL_LOGOUT));
    }

    return Facebook.loggedIn().then(authResponse =>
      FacebookManager._processAuthResponse(authResponse, true),
    );
  },

  /**
   * Authorize with Facebook and save credential on given user.
   * Returns a promise that when resolves, returns a collection of users
   * that are currently befriended in Blendle.
   *
   * @param  {User} user
   * @return {Promise}
   */
  authorizeAndGetFriends(user) {
    return this.authorize(user).then(this.getFriends);
  },

  /**
   * Process the Facebook authResponse and verify it with our backend
   *
   * @param  {Object} authResponse the Facebook authResponse object
   * @param  {Boolean} isAutoLogin
   * @return {Promise}
   */
  _processAuthResponse(authResponse, isAutoLogin = false) {
    return Auth.loginWithCredentials({
      facebook_id: authResponse.userID,
      facebook_access_token: authResponse.accessToken,
      fb_auto_logged_in: isAutoLogin,
    }).catch((err) => {
      if (err.status) {
        return Promise.reject({
          authResponse,
          status: this.statusCodes[err.status],
        });
      }
      throw err;
    });
  },
};

export default FacebookManager;



// WEBPACK FOOTER //
// ./src/js/app/managers/facebook.js