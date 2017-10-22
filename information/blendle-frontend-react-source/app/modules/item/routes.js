/* eslint-disable no-param-reassign */
import React from 'react';
import { history } from 'byebye';
import AuthStore from 'stores/AuthStore';
import ItemActions from 'actions/ItemActions';
import features from 'config/features';
import { asyncRoute } from 'helpers/routerHelpers';
import { replaceLastPath, isFamilyPath } from 'helpers/url';
import PremiumVerifiedOverlayContainer from 'containers/overlays/PremiumVerifiedOverlayContainer';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';
import ApplicationState from 'instances/application_state';
import Analytics from 'instances/analytics';
import { setDeeplink, removeDeeplink, hasDirectVisitClass } from './helpers/isDeeplink';

function onEnter(nextState, replace) {
  const { params } = nextState;
  const { query } = nextState.location;

  if (hasDirectVisitClass()) {
    // set the item id in the session storage to get redirect after login working
    setDeeplink(params.itemId);
  }

  if (query.p) {
    replace(`/login-email/${params.itemId}/${query.p}/${!!query.force_send}`);
    return;
  }

  if (!history.getPrevious()) {
    setDeeplink(params.itemId);
  } else {
    removeDeeplink(params.itemId);
  }

  if (!AuthStore.getState().user && features.deeplinkPremiumSignup && countryEligibleForPremium()) {
    // Classes are added in inline javascript in index.html
    document.body.classList.remove('direct-visit', 'm-item');
    replace(`/getpremium/item/${params.itemId}${nextState.location.search}`);
  }
}

const noEnterPath = ['/buy-warning', '/acquire'];
const isNoEnterPath = pathname => noEnterPath.some(path => pathname.endsWith(path));
function onEnterNoEntryPoint(nextState, replace) {
  const { pathname } = nextState.location;
  const { params } = nextState;

  if (!history.getPrevious() && isNoEnterPath(pathname)) {
    setDeeplink(params.itemId);
    const newPath = replaceLastPath(pathname, '');
    replace(newPath);
    return;
  }

  onEnter(nextState, replace);
}

function onLeave(nextState) {
  if (!isFamilyPath(nextState.location.pathname, window.location.pathname)) {
    document.body.classList.remove('direct-visit', 'm-item');
  }
}

// eslint-disable-next-line react/prop-types
function getOverlay({ location, params }) {
  if (!location.query.hasOwnProperty('verified')) {
    return null;
  }

  return (
    <PremiumVerifiedOverlayContainer
      dismissRoute={location.pathname}
      itemId={params.itemId}
      isDeeplink
    />
  );
}

function route(path, getComponentsHandler, other) {
  return {
    module: 'item',
    path,
    requireAuth: false,
    getComponents: asyncRoute(getComponentsHandler),
    ...other,
  };
}

function routeBuyItemWarning(path) {
  return {
    module: 'item',
    path,
    onEnter: onEnterNoEntryPoint,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            dialog: require('./containers/BuyItemWarningContainer'),
          });
        },
        'reader',
      );
    }),
  };
}

function routeAcquireItem(path) {
  return {
    module: 'item',
    path,
    onEnter: onEnterNoEntryPoint,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            dialog: require('./containers/AcquireItemContainer'),
          });
        },
        'reader',
      );
    }),
  };
}

const readerChildRoutes = [
  route('refund', (nextState, cb) => {
    require.ensure(
      [],
      () => {
        cb(null, { dialog: require('./containers/RefundContainer') });
      },
      'item',
    );
  }),
  routeBuyItemWarning('buy-warning'),
  routeAcquireItem('acquire'),
];

function routeItem(path) {
  return [
    {
      module: 'item',
      path,
      onEnter,
      onLeave,
      requireAuth: false,
      getComponents: asyncRoute((nextState, cb) => {
        require.ensure(
          [],
          () => {
            nextState.returnUrl =
              (nextState.location.state && nextState.location.state.returnUrl) ||
              nextState.returnUrl ||
              history.getPrevious() ||
              '/';

            if (/^(\/i\/|\/item\/|\/getpremium\/item\/)/.test(nextState.returnUrl)) {
              nextState.returnUrl = '/';
            }

            if (nextState.params.ref) {
              Analytics.track('referrer', { referrer: nextState.params.ref });
            }

            const { user } = AuthStore.getState();

            if (user) {
              ItemActions.openItem(nextState.returnUrl);
            } else {
              ApplicationState.set({ requireAuthUrl: nextState.location.pathname });
            }

            cb(null, {
              item: user
                ? require('./containers/ReaderContainer')
                : require('modules/deeplink/DeeplinkContainer'),
              overlay: () => getOverlay(nextState),
            });
          },
          'reader',
        );
      }),
      childRoutes: readerChildRoutes,
    },
  ];
}

function routeEmailVerification(path) {
  return {
    module: 'item',
    path,
    onEnter,
    onLeave,
    requireAuth: false,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            item: require('./containers/EmailVerificationContainer'),
          });
        },
        'reader',
      );
    }),
  };
}

export default [
  ...routeItem('item/:itemId'),
  ...routeItem('i/:provider/:itemName/:itemId'),
  ...routeItem('item/:itemId/welcome'),
  ...routeItem('item/:itemId/signup'),
  ...routeItem('item/:itemId/login'),
  ...routeItem('i/:provider/:itemName/:itemId/welcome'),
  ...routeItem('i/:provider/:itemName/:itemId/signup'),
  ...routeItem('i/:provider/:itemName/:itemId/login'),
  ...routeItem('item/:itemId/referrer/:ref'),
  ...routeItem('item/:itemId/ref/:ref'),
  ...routeItem('item/:itemId/r/:ref'),
  ...routeItem('i/:provider/:itemName/:itemId/referrer/:ref'),
  ...routeItem('i/:provider/:itemName/:itemId/ref/:ref'),
  ...routeItem('i/:provider/:itemName/:itemId/r/:ref'),
  routeEmailVerification('item/:itemId/verify-email/:emailToken'),
  routeEmailVerification('i/:provider/:itemName/:itemId/verify-email/:emailToken'),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/item/routes.js