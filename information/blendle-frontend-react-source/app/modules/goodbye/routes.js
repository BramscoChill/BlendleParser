import { asyncRoute } from 'helpers/routerHelpers';

export default [
  {
    requireAuth: false,
    module: 'goodbye',
    path: 'goodbye',
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const { openGoodbyeOverlay } = require('./module');

          cb(null, {
            overlay: openGoodbyeOverlay,
          });
        },
        'overlay',
      );
    }),
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/goodbye/routes.js