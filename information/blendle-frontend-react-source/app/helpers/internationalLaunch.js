import Cookies from 'cookies-js';
import Country from 'instances/country';
import Environment from 'environment';
import analytics from 'instances/analytics';
import settings from 'config/settings';

// During the US launch announcement we want to redirect all visitors of unsupported countries to
// launch.blendle.com.
const IGNORE_COOKIE = true;

const COOKIE_NAME = 'redirect_to_launch';
const ACCESS_CODE_COOKIE = 'redeemed_access_code';
const ALLOWED_PATHS = /^(\/login|\/access|\/about|\/i(tem)?\/|\/email|\/coupon)/;
const ALLOWED_SEARCH = /^\?(md_email)/;

export default {
  /**
   * check if the current visitor should be redirected to the launch page
   * @returns {boolean}
   */
  shouldRedirect() {
    // user's on approval or vodafone should never be redirected
    if (Environment.name === 'approval' || Environment.name === 'vodafone-prod') {
      return false;
    }

    // if the user visits a whitelisted path, then he may visit blendle.com
    if (
      ALLOWED_PATHS.test(window.location.pathname) ||
      ALLOWED_SEARCH.test(window.location.search)
    ) {
      this.setAccessCookie();
      return false;
    }

    if (Cookies.get(ACCESS_CODE_COOKIE)) {
      return false;
    }

    // if the user has been redirected, and the user's country isn't a beta country,
    // then he should be able to view blendle.com
    if (!IGNORE_COOKIE && Cookies.get(COOKIE_NAME) && !Country.isBetaCountry()) {
      return false;
    }

    // let the Country service decide if the user's country is supported.
    return !Country.isSupportedCountry() || Country.isBetaCountry();
  },

  setAccessCookie() {
    Cookies.set(ACCESS_CODE_COOKIE, true, {
      expires: 3600 * 24 * 365 /* 1 year */,
      secure: Environment.ssl,
    });
  },

  /**
   * redirect to the launch page and set a cookie
   */
  redirectToLaunchSite() {
    Cookies.set(COOKIE_NAME, true, {
      expires: 3600 * 24 * 365 /* 1 year */,
      secure: Environment.ssl,
    });

    analytics.track('Redirect to international launch', {
      country: Country.getCountryCode(),
      href: window.location.href,
      referrer: document.referrer,
    });

    // a small timeout to make sure the cookie is set.
    setTimeout(() => {
      window.location = 'https://launch.blendle.com';
    }, 100);
  },
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/internationalLaunch.js