import React from 'react';
import { asyncRoute } from 'helpers/routerHelpers';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';
import { blendlePremium } from 'config/features';

function onEnter(nextState, replace) {
  const { pathname } = nextState.location;

  // allow /signup/verify and /login/reset/token
  // eslint-disable-next-line no-useless-escape
  const allowedPathRegex = /\/signup\/verified|\/signup\/verify|\/\?md_email[^\/ ]+$|\/unsubscribe-newsletter\/[^\/ ]+$|\/login\/reset\/[^\/ ]+$/;

  // Use premium onboarding for countries in which premium is active
  if (!allowedPathRegex.test(pathname) && blendlePremium && countryEligibleForPremium()) {
    const premiumRoutesMap = {
      '/login/warning': '/getpremium/loginwarning',
      '/login/reset': '/getpremium/reset',
      '/login': '/getpremium/login',
      default: '/getpremium',
    };

    replace(premiumRoutesMap[pathname] || premiumRoutesMap.default);
    return;
  }

  document.body.classList.add('m-signup');
}

function onLeave() {
  document.body.classList.remove('m-signup');
}

export default [
  {
    module: 'signup',
    path: 'signup(/**)',
    requireAuth: false,
    onEnter,
    onChange: onEnter,
    onLeave,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./SignupModuleContainer'),
            primaryNavigation: require('./components/NavigationBar'),
          });
        },
        'signup',
      );
    }),
  },
  {
    module: 'signup',
    path: 'login(/**)',
    requireAuth: false,
    onEnter,
    onChange: onEnter,
    onLeave,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const Container = require('./SignupModuleContainer');
          const path = ['login', nextState.params.splat].join('/');
          cb(null, {
            content: () => <Container path={path} />,
            primaryNavigation: require('./components/NavigationBar'),
          });
        },
        'signup',
      );
    }),
  },
  {
    module: 'signup',
    path: 'logout(/:email)',
    requireAuth: true,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./LogoutContainer'),
            primaryNavigation: require('./components/NavigationBar'),
          });
        },
        'signup',
      );
    }),
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/routes.js