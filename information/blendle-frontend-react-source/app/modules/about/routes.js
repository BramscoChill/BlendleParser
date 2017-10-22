import { asyncRoute } from 'helpers/routerHelpers';

const routeBase = {
  module: 'about',
  requireAuth: false,
};

export default [
  {
    ...routeBase,
    path: '/about',
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            dialogue: require('./containers/AboutPageContainer'),
          });
        },
        'about',
      );
    }),
    indexRoute: {
      ...routeBase,
      getComponent: asyncRoute((nextState, cb) => {
        require.ensure(
          [],
          () => {
            cb(null, require('./components/About'));
          },
          'about',
        );
      }),
    },
    childRoutes: [
      {
        ...routeBase,
        path: 'blendle',
        onEnter: (nextState, replace) => replace('/about'),
      },
      {
        ...routeBase,
        path: 'termsandconditions',
        getComponent: asyncRoute((nextState, cb) => {
          require.ensure(
            [],
            () => {
              cb(null, require('./components/TermsAndConditions'));
            },
            'about',
          );
        }),
      },
      {
        ...routeBase,
        path: 'privacy',
        getComponent: asyncRoute((nextState, cb) => {
          require.ensure(
            [],
            () => {
              cb(null, require('./containers/PrivacyContainer'));
            },
            'about',
          );
        }),
      },
    ],
  },
  {
    ...routeBase,
    path: '/contact',
    indexRoute: {
      onEnter: (nextState, replace) => replace('/about'),
    },
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/about/routes.js