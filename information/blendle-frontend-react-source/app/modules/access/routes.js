import browserHistory from 'react-router/lib/browserHistory';
import Features from 'config/features';
import { asyncRoute } from 'helpers/routerHelpers';

function requireAuth(user) {
  if (user) {
    browserHistory.push('/');
  }
  return false;
}

function onEnter() {
  document.body.classList.add('m-access');
}

function onLeave() {
  document.body.classList.remove('m-access');
}

function routeAccess(path) {
  return {
    module: 'access',
    path,
    requireAuth,
    onEnter,
    onLeave,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const mod = require('./module');
          cb(null, {
            dialogue: () => mod.openPage(nextState.params.code),
          });
        },
        'access',
      );
    }),
  };
}

export default (Features.accesspage ? [routeAccess('access'), routeAccess('access/:code')] : []);



// WEBPACK FOOTER //
// ./src/js/app/modules/access/routes.js