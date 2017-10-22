import { HOME_ROUTE, PREMIUM_PROVIDER_ID, SIGNUP_PLATFORM_FACEBOOK } from 'app-constants';
import { curry, get } from 'lodash';
import { removeTrailingSlash } from 'helpers/url';
import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';

export function getSuccesOrOnboardingUrl(user, url) {
  return user.didOnboarding() ? url : '/getpremium/channels';
}

export function getOnboardingSuccessUrl(
  user,
  routeBase,
  { itemId, signupPlatform, affiliatesState },
) {
  const affiliateName = get(affiliatesState, 'affiliate.name');
  const affiliateFullUrl = get(affiliatesState, 'meta.vodafone_full_url');

  // @vodafone redirect to activate page after onboarding is done
  if (affiliateName === 'vodafone' && affiliateFullUrl) {
    const params = affiliateFullUrl.split('?')[1];
    return `getpremium/actie/${affiliateName}/activate?${params}`;
  }

  if (!itemId && shouldGetAutoRenewTrial()) {
    return '/home/success';
  }

  if (signupPlatform === SIGNUP_PLATFORM_FACEBOOK && !!itemId) {
    // Facebook signups already have confirmed emails
    // For deeplink facebook signups, always return to the item

    return `${HOME_ROUTE}`; // From here, they get redirected by APPLICATION_REDIRECT_URL.
  }

  if (user.get('email_confirmed')) {
    return user.hasActivePremiumSubscription() ? `${HOME_ROUTE}/success` : `${routeBase}/activate`;
  }

  return `${routeBase}/confirm`;
}

export function getLandingCtaUrl({ user, product, pathname = window.location.pathname } = {}) {
  const premiumLanding = removeTrailingSlash(pathname);

  if (user && !user.attributes.email_confirmed) {
    return `${premiumLanding}/confirm`;
  }

  if (product && !product.eligible) {
    return `/subscription/${PREMIUM_PROVIDER_ID}`;
  }

  if (user) {
    return `${premiumLanding}/channels`;
  }

  return `${premiumLanding}/signup`;
}

export const getRoute = curry((affiliateRoute, regularRoute, currentAffiliate) => {
  if (currentAffiliate && currentAffiliate.name) {
    return affiliateRoute.replace(':affiliateId', currentAffiliate.name);
  }

  return regularRoute;
});

export const getOnboardingRoute = (pathname) => {
  const baseRoute = removeTrailingSlash(pathname);
  const strippedRoute = baseRoute.replace(/\/signup|\/login/, '');

  return `${strippedRoute}/channels`;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/onboarding.js