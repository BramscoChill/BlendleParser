module.exports = (function () {
  const ByeBye = require('byebye');
  const Settings = require('controllers/settings');

  const ProviderManager = {
    /**
     * Favorite one or many providers for user
     * @param  {String} userId
     * @param  {Array|String} providers
     * @param {Boolean} toggle
     * @return {Promise}
     */
    favorite(userId, providers, toggle) {
      const providerIds = ByeBye.Helpers.toArray(providers).map(provider => ({ id: provider }));

      if (toggle) {
        return ByeBye.ajax({
          url: Settings.getLink('user_favourites', { user_id: userId }),
          type: 'POST',
          data: JSON.stringify(providerIds),
        }).then(resp => resp.data);
      }

      return Promise.all(
        providerIds.map(provider =>
          ByeBye.ajax({
            url: Settings.getLink('user_favourite', {
              user_id: userId,
              provider_id: provider.id,
            }),
            type: 'DELETE',
          }),
        ),
      );
    },
  };

  return ProviderManager;
}());



// WEBPACK FOOTER //
// ./src/js/app/managers/provider.js