module.exports = (function () {
  const ByeBye = require('byebye');
  const Q = require('q');
  const _ = require('lodash');
  const sprintf = require('sprintf-js').sprintf;
  const LibLoader = require('helpers/libloader');
  const Environment = require('environment');
  let library = '//connect.facebook.net/en_US/sdk.js';
  const TypedError = require('helpers/typederror');
  const constants = require('app-constants');

  if (Environment.name === 'test') {
    library = 'http://localhost:3000/static/scripts/facebook-js-stub.js';
  }

  const Facebook = new LibLoader(library, () => window.FB);

  _.extend(Facebook, {
    // TODO Move these settings outside of this lib.
    appId: '157559707786240',
    version: 'v2.6',

    scope: 'email,user_birthday,user_friends,public_profile,user_hometown,user_about_me',
    avatarUrl: 'https://graph.facebook.com/%s/picture',
    _authResponse: null, // Hold facebook authResponse
    _authRejection: null,

    /**
     * Holds output of api /me call.
     * TODO: refactor this variable into something more verbose
     */

    _me: false,

    /**
     * Default limit for getting friends.
     */

    _getFriendsLimit: 1000,

    getAvatar(username, size) {
      return sprintf(`${this.avatarUrl}?type=%s`, _.escape(username), size || 'square');
    },
    getAvatarWithDimensions(username, w, h) {
      return sprintf(`${this.avatarUrl}?width=%s&height=%s`, _.escape(username), w, h);
    },
    getAuthResponse() {
      return this._authResponse;
    },

    getFriendIDs() {
      return new Promise((resolve) => {
        Facebook.lib.api('/me/friends?limit=100', (resp) => {
          Facebook._fetchFacebookIDs([], resp).then(resolve);
        });
      });
    },

    _fetchFacebookIDs(ids, resp) {
      const self = this;

      ids = ids.concat(Facebook._processFacebookIDs(resp.data));

      if (resp.paging && resp.paging.next) {
        return ByeBye.ajax({ url: resp.paging.next }).then(resp =>
          self._fetchFacebookIDs(ids, resp.data),
        );
      }

      return Promise.resolve(ids);
    },

    _processFacebookIDs(users) {
      return _.map(users, user => ({ id: parseInt(user.id, 10) }));
    },

    /**
     * Create the redirect login url, based on the application settings
     *
     * @return {String} The login url
     * @api public
     */
    redirectLoginUrl() {
      const url = sprintf(
        'https://www.facebook.com/dialog/oauth?client_id=%s&redirect_uri=%s&scope=%s&response_type=none',
        this.appId,
        encodeURIComponent(window.location),
        this.scope,
      );

      return url;
    },

    loggedIn() {
      if (this._authResponse) {
        return Promise.resolve(this._authResponse);
      }
      return this.load().then(this._loggedIn.bind(this));
    },

    _loggedIn() {
      return new Promise((resolve, reject) => {
        const statusTimeout = setTimeout(() => {
          // For some reason the callback of getLoginStatus only gets called once
          // It could be that the auth response is only synced after the getLoginStatus
          // function is already called twice. In these cases, resolve or reject
          // Based on the result
          if (this._authResponse) {
            resolve(this._authResponse);
          }

          if (this._authRejection) {
            reject(this._authRejection);
          }

          reject(new TypedError(constants.LIBRARY_UNAVAILABLE));
        }, 4000);

        this.lib.getLoginStatus((resp) => {
          clearTimeout(statusTimeout);

          if (resp.status === 'connected') {
            this._authResponse = resp.authResponse;

            return resolve(resp.authResponse);
          }

          this._authRejection = new TypedError(
            'UnableToLogin',
            'Unable to get login status from Facebook',
            resp.data,
          );

          return reject(this._authRejection);
        });
      });
    },

    login() {
      // lib.login must be called directly. The loading of the lib should
      // be handled externally and listened to so that Login and other
      // facebook buttons are not even clickable before load is done.
      return new Promise((resolve, reject) => {
        Facebook.lib.login(
          (response) => {
            if (response.authResponse && response.authResponse.accessToken) {
              Facebook._authResponse = response.authResponse;
              return resolve(response);
            }
            return reject(new TypedError('UnableToLogin', 'Unable to log into Facebook', response));
          },
          { scope: Facebook.scope },
        );
      });
    },

    logout() {
      const self = this;
      const promise = Q.defer();

      this.execute('logout', (response) => {
        self._me = false;
        self._authResponse = false;

        promise.resolve(response);
      });

      return promise.promise;
    },

    getMe() {
      if (this._me) {
        return Promise.resolve(this._me);
      }

      const fields = ['email', 'first_name'];
      return new Promise((resolve, reject) => {
        this.loggedIn()
          .then(() => {
            this.execute('api', `/me?fields=${fields.join(',')}`, (response) => {
              if (response && !response.error) {
                this._me = response;
                resolve(response);
              } else {
                reject(response);
              }
            });
          })
          .catch(reject);
      });
    },

    getFriends(limit) {
      limit = limit || this._getFriendsLimit;
      const promise = Q.defer();
      const friends = [];

      this.execute(
        'api',
        `/me/friends?limit=${limit}`,
        this._processFriends.bind(this, friends, promise),
      );

      return promise.promise;
    },

    _processFriends(friends, promise, response) {
      if (!response || !response.data) {
        promise.reject(new Error('Unable to fetch Facebook friends'));
        return;
      }

      for (const i in response.data) {
        friends.push(response.data[i]);
      }

      // Do we need to get more friends (paging?) or
      // can we return what we got?
      if (response.paging && response.paging.next) {
        ByeBye.ajax({
          url: response.paging.next,
        }).then(this._processFriends.bind(this, friends, promise));
      } else {
        promise.resolve(friends);
      }
    },
  });

  return Facebook;
}());



// WEBPACK FOOTER //
// ./src/js/app/instances/facebook.js