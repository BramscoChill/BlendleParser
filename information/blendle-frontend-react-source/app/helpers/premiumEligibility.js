import Country from 'instances/country';
import AffiliatesStore from 'stores/AffiliatesStore';
import { hasBeenOnDeeplink } from 'modules/item/helpers/isDeeplink';

export function countryEligibleForPremium() {
  return Country.isPremiumCountry();
}

export function hasAccessToPremiumFeatures(user) {
  return (user && user.hasActivePremiumSubscription()) || countryEligibleForPremium();
}

export function shouldGetAutoRenewTrial(isDeeplink) {
  // Affiliate pages should always be excluded!
  if (AffiliatesStore.getState().affiliate || isDeeplink || hasBeenOnDeeplink()) {
    return false;
  }

  return Country.isPremiumCountry();
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/premiumEligibility.js