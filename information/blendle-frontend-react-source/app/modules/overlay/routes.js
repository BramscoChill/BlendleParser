import { history } from 'byebye';
import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('s-enable-overlay');
}

function onLeave() {
  document.body.classList.remove('s-enable-overlay');
}

export default [
  {
    module: 'overlay',
    path: 'overlay/premium-success',
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const mod = require('./module');

          cb(null, {
            overlay: () => mod.openPremiumSuccess(nextState.returnUrl || history.getPrevious()),
          });
        },
        'overlay',
      );
    }),
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/overlay/routes.js