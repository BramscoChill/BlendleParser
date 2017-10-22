import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('m-alerts');
  require.ensure(
    [],
    () => {
      const AlertsActions = require('actions/AlertsActions');
      AlertsActions.setActive();
    },
    'alerts',
  );
}

function onLeave() {
  document.body.classList.remove('m-alerts');
  require.ensure(
    [],
    () => {
      const AlertsActions = require('actions/AlertsActions');
      AlertsActions.setInactive();
    },
    'alerts',
  );
}

function routeAlerts(path) {
  return {
    module: 'alerts',
    path,
    onEnter,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            navigation: require('modules/alerts/AlertsNavigationContainer'),
            content: require('modules/alerts/AlertsContainer'),
          });
        },
        'alerts',
      );
    }),
  };
}

export default [
  routeAlerts('alerts'),
  routeAlerts('alerts/manage/:new'),
  routeAlerts('alerts/:query'),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/routes.js