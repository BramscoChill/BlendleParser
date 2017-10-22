import ByeBye from 'byebye';
import Auth from 'controllers/auth';
import Settings from 'controllers/settings';
import Users from 'collections/users';
import TypedError from 'helpers/typederror';

const BlendleTwitter = {
  /**
   * Authorize user with Twitter
   * @param  {User} user
   * @return {Promise}
   */
  authorize(user) {
    // If user is already connected to Twitter, authorization is done
    if (typeof user.get('twitter_id') !== 'string') {
      user.set('twitter_id', this.login(user));
    }

    // Login to twitter
    return user.get('twitter_id');
  },

  /**
   * Force a login for user with Twitter
   * @param {User} user
   * @return {Promise}
   */
  login() {
    const popupWindow = this._openPopup();

    return this._requestLoginUrl()
      .then((url) => {
        if (!popupWindow || popupWindow.closed) {
          return Promise.reject(
            new TypedError(
              'PopupClosed',
              'User has prematurily closed the Twitter authorization window',
            ),
          );
        }

        return this._getAuthorizationFromPopup(url, popupWindow);
      })
      .then(() => Auth.renewJWT()) // Renew JWT to get the new embedded user with twitter_id
      .then(() => Auth.fetchUser()); // Return the new user
  },

  /**
   * Unauthorize user with Twitter
   * @param {User} user
   * @return {Promise}
   */
  unauthorize(user) {
    if (!user.get('twitter_id')) {
      return Promise.resolve(user);
    }

    return ByeBye.ajax({
      url: Settings.getLink('oauth', { oauth_provider: 'twitter' }),
      type: 'DELETE',
    }).then(() => {
      user.set('twitter_id', null);
      return Auth.fetchUser();
    });
  },

  getFriends(user) {
    return ByeBye.ajax({
      url: Settings.getLink('follows', { user_id: user.id, reason: 'twitter' }),
    }).then(resp => Promise.resolve(new Users(resp.data, { parse: true })));
  },

  authorizeAndGetFriends(user) {
    return this.authorize(user).then(this.getFriends);
  },

  _requestLoginUrl() {
    return ByeBye.ajax({
      url: Settings.getLink('oauth', { oauth_provider: 'twitter' }),
    }).then(resp => Promise.resolve(resp.data.authorize_url));
  },

  _openPopup() {
    const popupWindow = window.open(
      'about:blank',
      'twitter',
      'height=400,width=600,status=no,menubar=no,toolbar=no,location=no',
    );

    popupWindow.focus();

    return popupWindow;
  },

  _getAuthorizationFromPopup(url, popupWindow) {
    popupWindow.location.href = url;

    return this._pollForStatus(popupWindow);
  },

  _pollForStatus(windowToPoll) {
    return new Promise((resolve, reject) => {
      const pollingId = setInterval(() => {
        if (!windowToPoll || windowToPoll.closed) {
          clearInterval(pollingId);

          reject(
            new TypedError(
              'PopupClosed',
              'User has prematurily closed the Twitter authorization window',
            ),
          );
        }

        windowToPoll.postMessage({ ping: true }, window.location.origin);
      }, 100);

      if (!windowToPoll || windowToPoll.closed) {
        reject(
          new TypedError(
            'PopupClosed',
            'User has prematurily closed the Twitter authorization window',
          ),
        );
      }

      window.addEventListener('message', (e) => {
        if (e.origin !== window.location.origin) {
          return;
        }

        clearInterval(pollingId);

        resolve(e.data);
      });
    });
  },
};

export default BlendleTwitter;



// WEBPACK FOOTER //
// ./src/js/app/managers/twitter.js