import { asyncRoute } from 'helpers/routerHelpers';
import Environment from 'environment';
import Features from 'config/features';
import Analytics from 'instances/analytics';
import googleAnalytics from 'instances/google_analytics';
import { HOME_ROUTE } from 'app-constants';
import { track } from 'helpers/premiumOnboardingEvents';
import AffiliatesActions from 'actions/AffiliatesActions';
import AffiliatesStore from 'stores/AffiliatesStore';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';
import Country from 'instances/country';
import AuthStore from 'stores/AuthStore';
import { debounce } from 'lodash';
import { getTrackingURL } from 'helpers/url';
import ApplicationState from 'instances/application_state';
import { getLocationInLayout, resetLocationInLayout } from 'helpers/locationInLayout';

// debounce since the event comes twice in one tick
const debouncedTrack = debounce((...args) => googleAnalytics.trackPageView(...args), {
  wait: 0,
  leading: false,
});

function trackPageViewWithGoogleAnalytics(location = window.location) {
  debouncedTrack(getTrackingURL(location));
}

// See comment for debouncedTrack()
const debouncedTrackEvent = debounce((...args) => googleAnalytics.trackEvent(...args), {
  wait: 0,
  leading: false,
});

const activatePage = '/getpremium/activate';

const shouldRedirectToPlatform = (user, affiliateState, affiliateRoute) =>
  user &&
  user.get('email_confirmed') &&
  user.hasActivePremiumSubscription() &&
  user.didOnboarding() &&
  !affiliateState.affiliate &&
  !affiliateRoute;

const storeAffilateData = (nextState) => {
  const { query } = nextState.location;
  const { params } = nextState;
  const affiliateId = params.affiliateId || query.affiliate;

  if (affiliateId) {
    AffiliatesActions.selectAffiliate(affiliateId);
  }

  if (affiliateId === 'vodafone' && window.location.search !== '') {
    ApplicationState.set('requireAuthUrl', activatePage);
    // always give the same path, even on different entry points
    const { origin, search } = window.location;
    AffiliatesActions.saveVodafoneMetaData(`${origin}/getpremium/actie/vodafone/signup${search}`);
  }
};

function onEnterNoAuth(nextState, replace) {
  document.body.classList.add('m-premiumsignup');
  const { user } = AuthStore.getState();
  const { params: { affiliateId }, location: { pathname } } = nextState;

  storeAffilateData(nextState);

  if (user && affiliateId === 'vodafone') {
    replace('/getpremium/vodafone-connect');
    return;
  }

  if (shouldRedirectToPlatform(user, AffiliatesStore.getState(), affiliateId)) {
    debouncedTrackEvent(pathname, 'redirect', 'user logged in');

    replace(HOME_ROUTE);
    return;
  }

  if (!countryEligibleForPremium() && Environment.name !== 'vodafone-prod') {
    debouncedTrackEvent(pathname, 'redirect', 'country redirect', Country.getCountryCode());

    replace('/');
  }
}

function onLeaveNoAuth() {
  document.body.classList.remove('m-premiumsignup');
}

function onLeave() {
  document.body.classList.remove('m-premiumsignup');
}

const onEnterDeeplink = (nextState, replace) => {
  const { location: { pathname } } = nextState;

  const isLoggedIn = AuthStore.getState().user;
  if (isLoggedIn || !countryEligibleForPremium()) {
    if (isLoggedIn) {
      debouncedTrackEvent(pathname, 'redirect', 'user logged in');
    } else {
      debouncedTrackEvent(pathname, 'redirect', 'country redirect', Country.getCountryCode());
    }

    replace(`/item/${nextState.params.itemId}`);
    return;
  }

  document.body.classList.add('s-premiumsignup-deeplink');
  onEnterNoAuth(nextState, replace);
};

const onLeaveDeeplink = (nextState, replace) => {
  document.body.classList.remove('s-premiumsignup-deeplink');
  onLeave(nextState, replace);
};

const baseRoute = { module: 'premiumsignup' };

function route(path, getComponentsHandler, other) {
  return {
    ...baseRoute,
    path,
    requireAuth: false,
    getComponents: asyncRoute(getComponentsHandler),
    ...other,
  };
}

const signupChildRoutes = [
  route(
    'signup',
    (nextState, cb) => {
      track(Analytics, 'Signup/Start', {
        location_in_layout: getLocationInLayout(),
      });
      trackPageViewWithGoogleAnalytics();

      // Remove the stored location_in_layout to make sure we don't sent it along with other events
      resetLocationInLayout();

      require.ensure(
        [],
        () => {
          cb(null, {
            body: require('./components/Authentication'),
            footer: require('./components/SignupFooter'),
            overlay: require('./components/SignupDisclaimer'),
          });
        },
        'premiumSignup',
      );
    },
    {
      onEnter: onEnterNoAuth,
      activeStepIndex: 0,
      animationKey: 'auth',
    },
  ),
  route(
    'login',
    (nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            body: require('./components/Authentication'),
            footer: require('./components/LoginFooter'),
            overlay: require('./components/SignupDisclaimer'),
          });
        },
        'premiumSignup',
      );
    },
    {
      onEnter: onEnterNoAuth,
      activeStepIndex: 1,
      animationKey: 'auth',
    },
  ),
  route(
    'loginwarning',
    (nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            dialog: require('./containers/LoginWarning'),
          });
        },
        'premiumSignup',
      );
    },
    {
      onEnter: onEnterNoAuth,
    },
  ),
  route(
    'reset',
    (nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            body: require('./components/Authentication'),
          });
        },
        'premiumSignup',
      );
    },
    {
      onEnter: onEnterNoAuth,
      activeStepIndex: 2,
      animationKey: 'auth',
    },
  ),
  route(
    'channels',
    (nextState, cb) => {
      trackPageViewWithGoogleAnalytics();

      require.ensure(
        [],
        () => {
          cb(null, {
            header: require('./components/Progress'),
            body: require('./containers/Channels'),
            footer: require('./containers/ChannelsFooterContainer'),
          });
        },
        'premiumSignup',
      );
    },
    {
      isOnboarding: true,
      fullScreen: true,
      progress: 30,
      // TODO: after stop of DeeplinkOnboardingSkipProviderStep, make progress fix
      deeplinkOnboardingSkipProviderStepSkipStepProgress: 40,
    },
  ),
  route(
    'publications',
    (nextState, cb) => {
      trackPageViewWithGoogleAnalytics();

      require.ensure(
        [],
        () => {
          cb(null, {
            header: require('./components/Progress'),
            body: require('./containers/Publications'),
            footer: require('./containers/PublicationsFooterContainer'),
          });
        },
        'premiumSignup',
      );
    },
    { isOnboarding: true, fullScreen: true, progress: 60 },
  ),
  route(
    'confirm',
    (nextState, cb) => {
      trackPageViewWithGoogleAnalytics();
      require.ensure(
        [],
        () => {
          cb(null, {
            header: require('./components/Progress'),
            body: require('./containers/ConfirmEmail'),
          });
        },
        'premiumSignup',
      );
    },
    {
      isOnboarding: true,
      fullScreen: true,
      progress: 90,
      // TODO: after stop of DeeplinkOnboardingSkipProviderStep, make progress fix
      deeplinkOnboardingSkipProviderStepSkipStepProgress: 80,
    },
  ),
  route(
    'redeem',
    (nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            header: require('./components/Progress'),
            body: require('./containers/Redeem'),
          });
        },
        'premiumSignup',
      );
    },
    { fullScreen: true, progress: 90 },
  ),
  route(
    'change-email',
    (nextState, cb) => {
      track(Analytics, 'Signup Change Email');
      require.ensure(
        [],
        () => {
          cb(null, {
            body: require('./containers/ChangeEmail'),
          });
        },
        'premiumSignup',
      );
    },
    { fullScreen: true },
  ),
  route(
    'activate',
    (nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            header: require('./components/Progress'),
            body: require('./containers/Activate'),
          });
        },
        'premiumSignup',
      );
    },
    { fullScreen: true, progress: 90 },
  ),
  route(
    'vodafone-connect',
    (nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            header: require('./components/Progress'),
            body: require('./components/VodafoneConnect'),
          });
        },
        'premiumSignup',
      );
    },
    { fullScreen: true, progress: 0 },
  ),
];

function premiumSignupRoute(path) {
  return {
    ...baseRoute,
    path,
    requireAuth: false,
    onEnter: onEnterNoAuth,
    onLeave: onLeaveNoAuth,
    getComponents: asyncRoute((nextState, cb) => {
      trackPageViewWithGoogleAnalytics();

      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./containers/PremiumFormLandingWithDetails'),
            primaryNavigation: require('./containers/PremiumNavigation'),
          });
        },
        'premiumSignup',
      );
    }),
    childRoutes: signupChildRoutes,
  };
}

function premiumDeeplinkRoute(path) {
  return {
    ...baseRoute,
    path,
    requireAuth: false,
    onEnter: onEnterDeeplink,
    onLeave: onLeaveDeeplink,
    getComponents: asyncRoute((nextState, cb) => {
      trackPageViewWithGoogleAnalytics();
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./containers/ItemDeeplinkLanding'),
            primaryNavigation: require('./containers/PremiumNavigation'),
          });
        },
        'premiumSignup',
      );
    }),
    childRoutes: signupChildRoutes,
    navigation: {
      hideLinks: true,
    },
  };
}

function premiumAffiliateRoute(path) {
  return {
    ...baseRoute,
    path,
    requireAuth: false,
    onEnter: onEnterNoAuth,
    onLeave: onLeaveNoAuth,
    getComponents: asyncRoute((nextState, cb) => {
      trackPageViewWithGoogleAnalytics();
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./containers/AffiliatePremiumLanding'),
            primaryNavigation: require('./containers/PremiumNavigation'),
          });
        },
        'premiumSignup',
      );
    }),
    childRoutes: signupChildRoutes,
  };
}

function premiumPersonaRoute(path) {
  return {
    ...baseRoute,
    path,
    requireAuth: false,
    onEnter: onEnterNoAuth,
    onLeave: onLeaveNoAuth,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          trackPageViewWithGoogleAnalytics();
          cb(null, {
            content: require('./containers/PremiumPersonaLandingContainer'),
            primaryNavigation: require('./containers/PremiumNavigation'),
          });
        },
        'premiumSignup',
      );
    }),
    childRoutes: signupChildRoutes,
    navigation: {
      hideLinks: true,
    },
  };
}

const signupRoutes = Features.blendlePremium
  ? [
    premiumSignupRoute('getpremium'),
    premiumDeeplinkRoute('getpremium/item/:itemId'),
    premiumAffiliateRoute('getpremium/actie/:affiliateId'),
    premiumPersonaRoute('getpremium/welcome/:personaId'),
  ]
  : [];

export default signupRoutes;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/routes.js