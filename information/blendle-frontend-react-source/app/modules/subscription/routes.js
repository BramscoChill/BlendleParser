import React from 'react';
import { PREMIUM_ALL_SUBSCRIPTION_PRODUCTS, PREMIUM_PROVIDER_ID } from 'app-constants';
import { asyncRoute } from 'helpers/routerHelpers';
import googleAnalytics from 'instances/google_analytics';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';
import { getTrackingURL } from 'helpers/url';

function onEnter() {
  document.body.classList.add('m-subscription');
}

function onLeave() {
  document.body.classList.remove('m-subscription');
}

const EmptyNavigation = () => <ul className="v-navigation collapsed" />;

function routeSubscription(path) {
  return {
    module: 'subscription',
    path,
    onEnter,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            navigation: EmptyNavigation,
            content: require('./SubscriptionUpgradeContainer'),
          });
        },
        'subscription',
      );
    }),
  };
}

function routePremiumSubscription(path, productId) {
  return {
    module: 'subscription',
    path,
    onEnter: (nextState, replace) => {
      onEnter();
      if (!countryEligibleForPremium()) {
        replace('/');
      }
    },
    onLeave,
    productId,
    getComponents: asyncRoute((nextState, cb) => {
      googleAnalytics.trackPageView(getTrackingURL(window.location));
      require.ensure(
        [],
        () => {
          cb(null, {
            navigation: EmptyNavigation,
            content: require('./PremiumSubscriptionUpgradeContainer'),
          });
        },
        'subscription',
      );
    }),
  };
}

const premiumSubscriptionRoutes = PREMIUM_ALL_SUBSCRIPTION_PRODUCTS.map(product =>
  routePremiumSubscription(`subscription/${product}`, product),
);

export default [
  ...premiumSubscriptionRoutes,
  routePremiumSubscription(`subscription/${PREMIUM_PROVIDER_ID}`, null),
  routeSubscription('subscription/:toId'),
  routeSubscription('subscription/:fromId/:toId'),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/subscription/routes.js