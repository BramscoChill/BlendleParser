import {
  PREMIUM_PROVIDER_ID,
  PREMIUM_PAID_SUBSCRIPTION_PRODUCTS,
  STATUS_ERROR,
  UPSELL_STATE,
} from 'app-constants';
import { isTrial, isExpired, isRenew } from 'selectors/subscriptions';
import { get } from 'lodash';

export function premiumProviderProducts(subscriptionProductsState) {
  return get(
    subscriptionProductsState,
    `providerProducts[${PREMIUM_PROVIDER_ID}].data._embedded[b:subscription-products]`,
    [],
  );
}
/**
 * Get all premium subscription products
 * @param subscriptionProductsState
 * @param subscriptionProductIds
 * @returns {Array}
 */
export function premiumSubscriptionProducts(
  subscriptionProductsState,
  subscriptionProductIds = PREMIUM_PAID_SUBSCRIPTION_PRODUCTS,
) {
  return premiumProviderProducts(subscriptionProductsState).filter(product =>
    subscriptionProductIds.includes(product.uid),
  );
}

export function premiumSubscriptionProduct(subscriptionProductsState, subscriptionProductId) {
  return premiumProviderProducts(subscriptionProductsState).find(
    product => product.uid === subscriptionProductId,
  );
}

export const isEligibleForTrial = premiumSubscriptionState =>
  premiumSubscriptionState.status === STATUS_ERROR && premiumSubscriptionState.error.status === 404; // 404 not found means there has never been a premium subscription

export const isExpiringTrial = subscription =>
  subscription && isTrial(subscription) && !isExpired(subscription) && !isRenew(subscription);

export const isEndedSubscription = subscription => subscription && isExpired(subscription);

export function getUpsellState(premiumSubscriptionState) {
  const { subscription } = premiumSubscriptionState;

  if (isEligibleForTrial(premiumSubscriptionState)) {
    return UPSELL_STATE.BEFORE_TRIAL;
  }

  if (isExpiringTrial(subscription)) {
    return UPSELL_STATE.DURING_EXPIRING_TRIAL;
  }

  if (isEndedSubscription(subscription)) {
    return UPSELL_STATE.ENDED_SUBSCRIPTION;
  }

  return UPSELL_STATE.NO_UPSELL;
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/premiumSubscriptions.js