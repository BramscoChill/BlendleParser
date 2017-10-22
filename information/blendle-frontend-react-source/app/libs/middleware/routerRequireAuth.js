import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import ApplicationState from 'instances/application_state';

function redirectToAuth(user, route) {
  if (typeof route.requireAuth === 'function') {
    return route.requireAuth(user, route);
  }
  if (route.requireAuth === false) {
    return false;
  }
  return !user;
}

export default function (authController) {
  return {
    renderRouteComponent(child, details) {
      const user = authController.getUser();
      if (redirectToAuth(user, details.route)) {
        setTimeout(() => {
          ApplicationState.set('requireAuthUrl', details.location.pathname);
          const pathname =
            details.location.pathname.indexOf('/settings') !== -1 ? '/login/warning' : '/login';

          browserHistory.push({
            pathname,
            state: {
              returnUrl: details.location.pathname,
            },
          });
        });
        return <span />;
      }
      return child;
    },
  };
}



// WEBPACK FOOTER //
// ./src/js/app/libs/middleware/routerRequireAuth.js