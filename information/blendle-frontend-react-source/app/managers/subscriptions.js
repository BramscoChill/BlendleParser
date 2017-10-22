import Auth from 'controllers/auth';

module.exports = (function () {
  const features = require('config/features');
  const _ = require('lodash');
  const Backbone = require('backbone');
  const Q = require('q');
  const Settings = require('controllers/settings');
  let providers = require('config/subscriptions');
  const getLink = require('helpers/hal').getLink;
  const moment = require('moment');
  const halZoom = require('helpers/halZoom').halZoom;

  // feature gate
  providers = _.filter(providers, (provider) => {
    if (provider.id in features.subscriptions) {
      return features.subscriptions[provider.id];
    }
    return true;
  });

  const fetchApi = _.memoize(apiLocation =>
    Backbone.ajax({
      url: apiLocation,
      headers: {
        Accept: 'application/hal+json',
      },
    }).then(res => res.data),
  );

  function ensureApi() {
    return fetchApi(Settings.getLink('microservice_subscriptions'));
  }

  const SubscriptionsManager = {
    getProviders() {
      return providers;
    },

    addSubscriptionWithUsernameAndPassword(provider, username, password) {
      const defer = Q.defer();

      Backbone.ajax({
        url: Settings.getLink('user_provider_accounts', { user_id: Auth.getId() }),
        type: 'POST',
        data: JSON.stringify({ provider, username, password }),
      }).then(
        (response) => {
          if (response.status === 201) {
            defer.resolve(response);
          } else {
            defer.reject(new Error('Unknown status code'));
          }
        },
        (response) => {
          defer.reject(response);
        },
      );

      return defer.promise;
    },

    addSubscriptionWithAuthorizationCode(provider, code) {
      const defer = Q.defer();

      Backbone.ajax({
        url: Settings.getLink('user_provider_accounts', { user_id: Auth.getId() }),
        type: 'POST',
        data: JSON.stringify({ provider, authorization_code: code }),
      }).then(
        (response) => {
          if (response.status === 201) {
            defer.resolve(response);
          } else {
            defer.reject(new Error('Unknown status code'));
          }
        },
        (response) => {
          defer.reject(response);
        },
      );

      return defer.promise;
    },

    addSubscriptionWithAuthURI(provider, authUri) {
      const defer = Q.defer();

      Backbone.ajax({
        url: Settings.getLink('user_provider_accounts', { user_id: Auth.getId() }),
        type: 'POST',
        data: JSON.stringify({ provider, auth_uri: authUri }),
      }).then(
        (response) => {
          if (response.status === 201) {
            defer.resolve(response);
          } else {
            defer.reject(new Error('Unknown status code'));
          }
        },
        (response) => {
          defer.reject(response);
        },
      );

      return defer.promise;
    },

    stopSubscription(userId, subscriptionUid) {
      return ensureApi().then((api) => {
        const url = getLink(api, 'user_subscription', {
          user_uid: userId,
          subscription_uid: subscriptionUid,
        });

        return Backbone.ajax({
          url,
          type: 'POST',
          headers: {
            Accept: 'application/hal+json',
          },
          data: {
            renew: false,
          },
        });
      });
    },

    deleteSubscription(provider) {
      const defer = Q.defer();

      Backbone.ajax({
        url: `${Settings.getLink('user_provider_accounts', { user_id: Auth.getId() })}/${provider}`,
        type: 'DELETE',
      }).then(
        (response) => {
          if (response.status === 204) {
            defer.resolve(response);
          } else {
            defer.reject(new Error('Unknown status code'));
          }
        },
        (response) => {
          defer.reject(response);
        },
      );

      return defer.promise;
    },

    /**
     * fetch legacy subscriptions from core-service and subscriptions from the subscription-service
     * @param userId
     * @param options
     * @returns {Promise.<Promise>}
     */
    getUserSubscriptions(userId, { active = true } = {}) {
      const fetchSubscriptionsWithSuccessor = (api) => {
        const baseUrl = getLink(api, 'user_subscriptions', { user_uid: userId });
        const query = active ? '?active=true' : '';

        return Backbone.ajax({
          url: `${baseUrl}${query}`,
          type: 'GET',
          headers: {
            Accept: 'application/hal+json',
          },
        }).then((response) => {
          const subscriptions = response.data._embedded['b:subscriptions'];
          // TODO: Remove when new latest endpoint from all providers is available
          response.data._embedded['b:subscriptions'] = subscriptions // eslint-disable-line no-param-reassign
            .filter(subscription => subscription.status === 'paid');

          // zoom the successor link
          const zoomFetches = response.data._embedded['b:subscriptions'].map(subscription =>
            halZoom(subscription._embedded['b:subscription-product'], 'successor'),
          );
          return Promise.all(zoomFetches).then(() => response);
        });
      };

      // We have to merge the subscriptions from core and the microservice
      return ensureApi().then(api =>
        Promise.all([
          Backbone.ajax({
            url: Settings.getLink('user_provider_accounts', { user_id: userId }),
            type: 'GET',
          }),
          fetchSubscriptionsWithSuccessor(api),
        ]),
      );
    },

    fetchSubscription(subscriptionId, userId, { active = true } = {}) {
      return ensureApi()
        .then((api) => {
          const query = active ? '?active=true' : '';

          return Backbone.ajax({
            url: `${getLink(api, 'user_subscription', {
              subscription_uid: subscriptionId,
              user_uid: userId,
            })}${query}`,
            type: 'GET',
            headers: {
              Accept: 'application/hal+json',
            },
          });
        })
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          return Promise.reject();
        });
    },

    fetchProduct(id) {
      return ensureApi()
        .then(api =>
          Backbone.ajax({
            url: getLink(api, 'subscription_product', { subscription_product_uid: id }),
            type: 'GET',
            headers: {
              Accept: 'application/hal+json',
            },
          }),
        )
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          return Promise.reject();
        });
    },

    fetchProviderProducts(providerId) {
      return ensureApi()
        .then(api =>
          Backbone.ajax({
            url: getLink(api, 'provider', { provider_uid: providerId }),
            type: 'GET',
            headers: {
              Accept: 'application/hal+json',
            },
          }),
        )
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
          return Promise.reject();
        });
    },

    createOrder(
      {
        user_uuid,
        subscriptionProductId,
        paymentType,
        vodafone_full_url,
        acceptHeader,
        relation = 'user_orders',
      },
      userId,
    ) {
      const Accept = acceptHeader || 'application/jwt';

      return ensureApi()
        .then(api =>
          Backbone.ajax({
            url: getLink(api, relation, { user_uid: userId }),
            type: 'POST',
            headers: { Accept },
            data: JSON.stringify({
              subscription_uid: subscriptionProductId,
              payment_type: paymentType,
              vodafone_full_url,
              user_uuid,
            }),
          }),
        )
        .then((response) => {
          if (response.status === 201) {
            return response.data;
          }
          return Promise.reject();
        });
    },
  };

  return SubscriptionsManager;
}());



// WEBPACK FOOTER //
// ./src/js/app/managers/subscriptions.js