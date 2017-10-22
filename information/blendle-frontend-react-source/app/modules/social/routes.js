import { asyncRoute } from 'helpers/routerHelpers';

export default [
  {
    module: 'social',
    path: 'social(/:page)',
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            dialogue: require('modules/social/SocialPage'),
          });
        },
        'social',
      );
    }),
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/social/routes.js