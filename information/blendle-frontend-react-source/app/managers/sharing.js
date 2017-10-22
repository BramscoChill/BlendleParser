module.exports = (function () {
  const ByeBye = require('byebye');
  const Q = require('q');
  const Settings = require('controllers/settings');
  const axios = require('axios');
  const environment = require('environment');

  const SharingManager = {
    /**
     * Request a unique link for the given item and service. This link
     * can be shared and accessed exactly one time by the external service provided.
     *
     * @param  {String} itemId id of the item to request a unique link for
     * @param  {String} service the service to allow access (for now getpocket.com and instapaper.com)
     * @return {Promise} a promise which, if successful, returns the unique url
     */
    requestUniqueAccessURL(itemId, service) {
      const self = this;
      const defer = Q.defer();

      const ajaxOptions = {
        url: Settings.getLink('onetimelink', { item_id: itemId, service }),
        type: 'POST',
      };

      // This is a solution for the problem with the standalone browser. It relies on a small
      // change in sparta, because the open a new url event needs to happen on the same
      // thread as the initial click. Therefor no promises can be used in between.
      if (navigator.standalone) {
        ajaxOptions.async = false;
        ajaxOptions.success = function (response) {
          const a = document.createElement('a');
          a.setAttribute('href', self._createPocketUrl(response.data.url));
          a.setAttribute('target', '_blank');

          const dispatch = document.createEvent('HTMLEvents');
          dispatch.initEvent('click', true, true);
          a.dispatchEvent(dispatch);

          defer.resolve(response.data.url);
        };
      }

      ByeBye.ajax(ajaxOptions).then(
        (response) => {
          if (response.status === 201) {
            defer.resolve(response.data.url);
          } else {
            defer.reject(response);
          }
        },
        (response) => {
          defer.reject(response);
        },
      );

      return defer.promise;
    },

    /**
     * Share itemId to pocket
     *
     * @param  {String} itemId the item to share to pocket
     * @return {Promise} promise
     */
    shareToPocket(itemId) {
      const self = this;

      let pocketWindow;
      if (!navigator.standalone) {
        pocketWindow = window.open('about:blank', 'pocket', 'width=550,height=300');
      }

      return SharingManager.requestUniqueAccessURL(itemId, 'getpocket.com').then(
        (url) => {
          if (!navigator.standalone) {
            pocketWindow.location.href = self._createPocketUrl(url);
          }
        },
        () => {
          console.error('Something went wrong then requesting sharing URL from manager.'); // jshint ignore:line
        },
      );
    },

    /**
     * Share itemId to e-mail
     *
     * @param  {Number} userId
     * @param  {String} itemId
     * @param  {Array} emails
     * @param  {String} message
     * @return {Promise} promise
     */
    shareToEmail(userId, itemId, emails, message) {
      return ByeBye.ajax({
        url: Settings.getLink('email_share', { user_id: userId }),
        type: 'POST',
        data: JSON.stringify({
          item_id: itemId,
          emails,
          message,
        }),
      });
    },

    shareToFollowing(userId, itemId, text) {
      const link = Settings.getLink('posts', { user_id: userId });

      return axios.post(link, {
        id: itemId,
        text,
      });
    },

    removeShareToFollowing(userId, itemId) {
      const base = environment.credentials.replace('/credentials', '');
      // TODO: use link in embedded user-post
      const link = `${base}/user/${userId}/post/${itemId}`;
      return axios.delete(link, { id: itemId });
    },

    shareToChannel({ channel, itemId, message, publicationTime }) {
      const url = Settings.getLink('posts', { user_id: channel.id });
      return axios
        .post(url, {
          id: itemId,
          text: message,
          published_at: publicationTime,
        })
        .then(resp => resp.data);
    },

    fetchItemPosts(userId, itemId) {
      const url = Settings.getLink(
        'item_posts',
        {
          user_context: userId,
          item_id: itemId,
        },
        ['b:user', 'b:manager'],
      );

      return axios
        .get(url, {
          headers: {
            accept: 'application/hal+json',
          },
        })
        .then(resp => resp.data);
    },

    _createPocketUrl(url) {
      return `https://getpocket.com/edit?url=${encodeURIComponent(url)}`;
    },
  };

  return SharingManager;
}());



// WEBPACK FOOTER //
// ./src/js/app/managers/sharing.js