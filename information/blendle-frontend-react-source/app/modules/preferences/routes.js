import { asyncRoute } from 'helpers/routerHelpers';
import Analytics from 'instances/analytics';
import { track } from 'helpers/premiumOnboardingEvents';

function route(path, getComponentsHandler, other) {
  return {
    module: 'preferences',
    path,
    requireAuth: true,
    getComponents: asyncRoute(getComponentsHandler),
    ...other,
  };
}

const routes = [
  route(
    'preferences',
    (nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./containers/ReadingPrefsContainer'),
          });
        },
        'premiumSignup',
      ); // Use premiumsignup chunk because of shared code
    },
    {
      childRoutes: [
        route(
          'channels',
          (nextState, cb) => {
            require.ensure(
              [],
              () => {
                cb(null, {
                  body: require('modules/premiumSignup/containers/Channels'),
                  footer: require('modules/premiumSignup/containers/ChannelsFooterContainer'),
                });
              },
              'premiumSignup',
            );
          },
          { nextUrl: '/preferences/publications' },
        ),
        route('publications', (nextState, cb) => {
          track(Analytics, 'Browse Publications');

          require.ensure(
            [],
            () => {
              cb(null, {
                body: require('modules/premiumSignup/containers/Publications'),
                footer: require('modules/preferences/components/PreferencesFooter'),
              });
            },
            'premiumSignup',
          );
        }),
      ],
    },
  ),
];

export default routes;



// WEBPACK FOOTER //
// ./src/js/app/modules/preferences/routes.js