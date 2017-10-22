import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('m-coupon');
}

function onLeave() {
  document.body.classList.remove('m-coupon');
}

function routeCoupon(path) {
  return {
    module: 'coupon',
    path,
    requireAuth: false,
    onEnter,
    onLeave,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const mod = require('./module');
          cb(null, {
            overlay: () => mod.openRedeem(nextState.params.code || null),
          });
        },
        'coupon',
      );
    }),
  };
}

function routeGift(path) {
  return {
    module: 'coupon',
    path,
    requireAuth: false,
    onEnter,
    onLeave,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const mod = require('./module');
          cb(null, {
            overlay: () => mod.openGift(),
          });
        },
        'coupon',
      );
    }),
  };
}

export default [
  routeGift('coupon/gift'),
  routeGift('cadeautje'),
  routeGift('cadeautje.'),
  routeCoupon('coupon(/:code)'),
  routeCoupon('cadeaubon(/:code)'),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/routes.js