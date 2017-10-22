import { PREMIUM_TRIAL_PRODUCT } from '../app-constants';

export function getCustomCopy(copyKey, affiliate) {
  if (!affiliate || !affiliate.copy) {
    return {};
  }

  return affiliate.copy[copyKey] || {};
}

export function getAffiliatesSubscriptionProduct({ affiliate }) {
  return affiliate && affiliate.subscriptionProduct
    ? { subscriptionProductId: affiliate.subscriptionProduct }
    : { subscriptionProductId: PREMIUM_TRIAL_PRODUCT };
}

export function getSignUpAffiliateMetaData({ affiliate } = {}) {
  // the { signup_type: 'premium'} automatically adds
  // a premium trial subscription to a newly created account.
  // except when affiliate is defined and has a different flow
  // in the backend
  if (affiliate && affiliate.name === 'vodafone') {
    return {
      signup_type: 'premium',
      affiliate: affiliate.name,
    };
  }

  return { signup_type: 'premium' };
}

export function getVodafoneAffiliateMetaData({ meta }) {
  if (meta && meta.vodafone_full_url) {
    return {
      ...meta,
      vodafone_full_url: decodeURIComponent(meta.vodafone_full_url),
      relation: 'vodafone_user_orders',
    };
  }

  return {};
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/affiliates.js