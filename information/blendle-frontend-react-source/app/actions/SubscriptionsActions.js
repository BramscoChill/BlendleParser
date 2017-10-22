import alt from 'instances/altInstance';
import * as subscriptionManager from 'managers/subscriptions';
import Auth from 'controllers/auth';
import { get } from 'lodash';
import moment from 'moment';
import Analytics from 'instances/analytics';
import { providerById, prefillSelector } from 'selectors/providers';

function getProviderName(providerUid) {
  return prefillSelector(providerById)(providerUid).name;
}

function formatLegacySubscription(subscription) {
  return {
    isLegacy: true,
    uid: subscription._embedded.provider.id,
    renew: !subscription.expires_at,
    trial: !!subscription.expires_at,
    expired: subscription.expires_at ? moment(subscription.expires_at).isBefore(new Date()) : false,
    startDate: moment(subscription.created_at),
    endDate: moment(subscription.expires_at),
    provider: {
      uid: subscription._embedded.provider.id,
    },
  };
}

function formatSubscription(subscription) {
  const product = subscription._embedded['b:subscription-product'];

  return {
    uid: subscription.subscription_uid,
    renew: subscription.renew,
    trial: subscription.trial,
    expired: subscription.expired,
    status: subscription.status,
    startDate: moment(subscription.start_date),
    endDate: moment(subscription.end_date),
    provider: {
      uid: product.provider_uid,
    },
    product,
  };
}

function formatSubscriptions(microserviceSubscriptions, legacySubscriptions) {
  const formatedMircoservice = microserviceSubscriptions.map(subscription =>
    formatSubscription(subscription),
  );
  const formatedLegacy = legacySubscriptions.map(subscription =>
    formatLegacySubscription(subscription),
  );

  return formatedMircoservice.concat(formatedLegacy);
}

class SubscriptionsActions {
  constructor() {
    this.generateActions(
      'fetchUserSubscriptionsSuccess',
      'fetchUserSubscriptionsError',
      'fetchUserSubscriptionSuccess',
    );
  }

  stopSubscription(userId, subscriptionUid, reason) {
    return (dispatch) => {
      dispatch({ subscriptionUid });

      const eventPayload = {
        subscription_product_uid: subscriptionUid,
        reason,
        subscription_type: 'internal',
      };

      subscriptionManager
        .stopSubscription(userId, subscriptionUid)
        .then(() => {
          this.fetchUserSubscriptions(userId);

          Analytics.track('Subscription Cancel', eventPayload);
        })
        .catch(() => {
          Analytics.track('Subscription Cancel Failed', eventPayload);
        });
    };
  }

  cancelSubscription(userId, providerId) {
    return (dispatch) => {
      dispatch({ providerId });

      const eventPayload = {
        providerId,
        provider: getProviderName(providerId),
        subscription_type: 'external',
      };

      subscriptionManager
        .deleteSubscription(providerId)
        .then(() => {
          this.fetchUserSubscriptions(userId);

          // Two events, because deleting actually removes to subscription as opposed to just
          // stopping it.
          Analytics.track('Subscription Cancel', eventPayload);
          Analytics.track('Subscription Remove', eventPayload);
        })
        .catch(() => {
          Analytics.track('Subscription Cancel Failed', eventPayload);
          Analytics.track('Subscription Remove Failed', eventPayload);
        });
    };
  }

  fetchUserSubscription(subscriptionId, userId, options) {
    subscriptionManager
      .fetchSubscription(subscriptionId, userId, options)
      .then(formatSubscription.bind(this))
      .then(this.fetchUserSubscriptionSuccess)
      .catch(this.fetchUserSubscriptionError);

    return null;
  }

  fetchUserSubscriptionError(error) {
    const errorHasSubscription = error.data && error.data.hasOwnProperty('subscription_uid');

    // @WARNING - During the upsell flow, the 'from' subscription call sometimes returns 402 because
    // the user is in a weird pending-payment state. But when the user is in that state, he should still
    // be allowed to go through the upsell flow
    let subscription;
    if (error.status === 402 && errorHasSubscription) {
      subscription = formatSubscription(error.data);
    }

    return { error, subscription };
  }

  pollFetchUserSubscription(subscriptionId, userId) {
    const maxLoops = 10;
    let loopCount = 0;

    return (dispatch) => {
      dispatch({ userId });

      return new Promise((resolve, reject) => {
        const fetchSubscription = () => {
          subscriptionManager.fetchSubscription(subscriptionId, userId).then(resolve, () => {
            if (loopCount < maxLoops) {
              loopCount++;
              setTimeout(fetchSubscription, 500 + 250 * loopCount);
            } else {
              reject(new Error(`Cannot fetch valid subscription after ${loopCount + 1} times.`));
            }
          });
        };
        setTimeout(fetchSubscription, 500);
      })
        .then(formatSubscription.bind(this))
        .then(subscription => Auth.renewJWT().then(() => Promise.resolve(subscription))) // Refresh user for embedded active_subscription
        .then(this.fetchUserSubscriptionSuccess)
        .catch((error) => {
          this.fetchUserSubscriptionError(error);
          throw error;
        });
    };
  }

  fetchUserSubscriptions(userId, options) {
    return (dispatch) => {
      dispatch({ userId });

      subscriptionManager
        .getUserSubscriptions(userId, options)
        .then(([legacyRes, microserviceRes]) => {
          const microserviceSubscriptions = get(
            microserviceRes.data,
            ['_embedded', 'b:subscriptions'],
            [],
          );
          const legacySubscriptions = get(
            legacyRes.data,
            ['_embedded', 'provider_accounts'],
            [],
          ).map(subscription => ({
            ...subscription,
            isLegacy: true,
          }));

          const allSubscriptions = formatSubscriptions(
            microserviceSubscriptions,
            legacySubscriptions,
          );

          this.fetchUserSubscriptionsSuccess(allSubscriptions);
        })
        .catch((error) => {
          this.fetchUserSubscriptionsError(error);

          throw error;
        });
    };
  }

  updateCancelReason(reason) {
    return reason;
  }

  selectSubscription(subscription) {
    return { subscription };
  }

  deselectSubscription() {
    return {};
  }
}

export default alt.createActions(SubscriptionsActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/SubscriptionsActions.js