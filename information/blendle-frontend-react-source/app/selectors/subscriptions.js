import moment from 'moment';
import { get, groupBy, values } from 'lodash';
import { compose } from 'recompose';
import { currentCurrency } from 'instances/i18n';
import { PREMIUM_ALL_SUBSCRIPTION_PRODUCTS } from 'app-constants';

export const isActive = ({ expired, startDate, endDate, isLegacy }) =>
  !expired &&
  (moment().isBetween(startDate, endDate) ||
    moment().isSameOrBefore(startDate) ||
    (isLegacy && !expired));

export const activeSubscriptions = subscriptions =>
  subscriptions.filter(isActive).sort((a, b) => b.startDate - a.startDate);

export const getSubscription = (subscriptions, subscriptionId) =>
  subscriptions.find(subscription => subscription.uid === subscriptionId);

export const getSubscriptionsByIds = (subscriptions, subscriptionIds) =>
  subscriptionIds
    .map(subscriptionId => subscriptions.find(subscription => subscription.uid === subscriptionId))
    .filter(subscription => subscription);

export const groupSubscriptionsByProvider = subscriptions =>
  values(groupBy(subscriptions, subscription => subscription.provider.uid));

export const isTrial = product => product && product.trial;

export const isExpired = product => product.expired === true;

export const isRenew = product => product.renew === true;

export const inFuture = product => product.startDate.isAfter(moment());

export const eligibleForAcquisition = (issueAcquisition, user) =>
  issueAcquisition.isEligibleForAcquisition() &&
  !issueAcquisition.get('acquired') &&
  !user.isFreeloader();

export const isActiveContinuousSubscription = product =>
  !!product && isActive(product) && isRenew(product);

// Returns trial subscription of provider which will end in a week and has a successor
export const filterUpgrade = (subscriptions, providerId) => {
  const trial = subscriptions.find(
    subscription =>
      subscription.provider.uid === providerId &&
      subscription.trial &&
      subscription.endDate.startOf('day').diff(moment().startOf('day'), 'days') <= 7 &&
      get(subscription.product, '_links.successor.href'),
  );

  if (!trial) {
    return null;
  }

  // Check if user already did an upgrade
  const successorId = get(trial, 'product._links.successor.href')
    ? trial.product._links.successor.href.split('/').pop()
    : '';
  if (!subscriptions.some(subscription => subscription.uid === successorId)) {
    return trial;
  }

  return null;
};

// Get regular subscriptions
export const filterSubscription = (providerProducts, excludeProducts = []) => {
  if (!providerProducts.data) {
    return null;
  }

  return providerProducts.data._embedded['b:subscription-products'].find(
    subscription =>
      !subscription.trial &&
      subscription.public &&
      subscription.eligible &&
      !excludeProducts.find(excludeProduct => excludeProduct.uid === subscription.uid),
  );
};
/**
 * Returns true if the current offer is a promo, the successor product is not the same as
 * the current product.
 * @param  {Object} offer
 * @return {Boolean}
 */
export const isPromo = (offer) => {
  const successor = get(offer, ['_links', 'successor', 'href']);
  const self = get(offer, ['_links', 'self', 'href']);

  return self !== successor;
};

/**
 * Returns the tiers of a subscription
 * @param  {Object} subscriptionProduct The subscriptionProduct to get the tier from
 * @return {Array}               Tiers of the subscription
 */
export function getSubscriptionTiers(subscriptionProduct) {
  return get(subscriptionProduct, ['_embedded', 'b:tier', '_embedded', 'b:tier-prices'], []);
}

/**
 * Returns the string with currency and price of subscription
 * @param  {Object} subscription subscriptionProductsState from the SubscriptionsProductsStore
 * @return {String}              String with currency, followed by a space and the price in decimal
 */
export function getSubscriptionPriceFromTiers(subscription) {
  const tiers = getSubscriptionTiers(subscription);
  const price = tiers.find(tier => tier.currency === currentCurrency);

  return price.amount;
}

export function getMonthlySubscriptionProductPrice(product) {
  const price = parseFloat(getSubscriptionPriceFromTiers(product));

  const [duration, measurement] = product.interval.split(' ');
  const momentDuration = moment.duration(parseInt(duration, 0), measurement);

  if (momentDuration.asYears() === 1) {
    return (price / 12).toFixed(2);
  }

  return price;
}

export function getRemainingDays(subscription) {
  return Math.floor(subscription.endDate.diff(moment(), 'days', true));
}

export const isPremiumSubscription = subscription =>
  PREMIUM_ALL_SUBSCRIPTION_PRODUCTS.includes(subscription.uid);

export const subscriptionsWithStatus = (status = ['paid']) => subscriptions =>
  subscriptions.filter(subscription => status.includes(subscription.status));

export function hasOneOfActiveSubscriptions(
  oneOfSubscriptions,
  userSubscriptions,
  status = ['paid'],
) {
  const statusCheck = subscriptionsWithStatus(status);
  const subscriptions = compose(activeSubscriptions, getSubscriptionsByIds)(
    userSubscriptions,
    oneOfSubscriptions,
  );

  // return subscriptions;
  return statusCheck(subscriptions).length > 0;
}

export function hasOneOfSubscriptions(oneOfSubscriptions, userSubscriptions, status = ['paid']) {
  const statusCheck = subscriptionsWithStatus(status);
  const subscriptions = getSubscriptionsByIds(userSubscriptions, oneOfSubscriptions);

  return statusCheck(subscriptions).length > 0;
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/subscriptions.js