import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('m-login-email');
}

function onLeave() {
  document.body.classList.remove('m-login-email');
}

export default [
  {
    module: 'emailLogin',
    path: 'login-email/:itemId/:token(/:force)',
    onEnter,
    onLeave,
    requireAuth: false,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const mod = require('./module');
          const params = nextState.params;
          cb(null, {
            item: () => mod.openItemLogin(params.itemId, params.token, params.force),
          });
        },
        'emailLogin',
      );
    }),
  },
  {
    module: 'emailLogin',
    path: 'login-email/:token',
    onEnter,
    onLeave,
    requireAuth: false,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const mod = require('./module');
          const params = nextState.params;
          cb(null, {
            item: () => mod.openTokenLogin(params.token),
          });
        },
        'emailLogin',
      );
    }),
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/emailLogin/routes.js