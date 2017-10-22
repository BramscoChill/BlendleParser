import { signUpPayload } from 'selectors/signUp';
import {
  SIGNUP_TYPE_DEEPLINK,
  SIGNUP_TYPE_AFFILIATE,
  SIGNUP_TYPE_PAID_ADVERTISEMENT,
  SIGNUP_TYPE_PREMIUM_ONBOARDING,
} from 'app-constants';

export const internalLocation = (pathname) => {
  const isDeeplink = /\/getpremium\/item\//.test(pathname);
  const isAffiliateSignUp = /\/getpremium\/actie\//.test(pathname);
  const isPersonaSignup = /\/getpremium\/welcome\//.test(pathname);
  const isPrefencesRoute = /\/preferences\//.test(pathname);

  if (isDeeplink) {
    return signUpPayload(SIGNUP_TYPE_DEEPLINK).internal_location;
  }

  if (isAffiliateSignUp) {
    return signUpPayload(SIGNUP_TYPE_AFFILIATE).internal_location;
  }

  if (isPersonaSignup) {
    return signUpPayload(SIGNUP_TYPE_PAID_ADVERTISEMENT).internal_location;
  }

  if (isPrefencesRoute) {
    return 'preferences';
  }

  return signUpPayload(SIGNUP_TYPE_PREMIUM_ONBOARDING).internal_location;
};

export const track = (instance, eventName, eventPayload) =>
  instance.track(eventName, {
    ...eventPayload,
    internal_location: internalLocation(window.location.pathname),
  });

/**
 * Check if we should send click events to Google Analytics. We don't want to send them on the deeplink at the moment
 * @param  {String} pathname Current pathname
 * @return {Bool}
 */
export const shouldTrackGAClickEvent = (pathname) => {
  const isItemUrl = /(\/getpremium)?\/i(tem)?\//.test(pathname);

  return !isItemUrl;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/premiumOnboardingEvents.js