import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('m-kiosk');
}

function onLeave() {
  document.body.classList.remove('m-kiosk');
}

function routeKiosk(path) {
  return {
    module: 'kiosk',
    path,
    onEnter,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('modules/kiosk/KioskRouterContainer'),
            navigation: require('modules/timeline/TimelineNavigationContainer'),
            legoDialog: require('containers/dialogues/PayPerArticleWarningDialogContainer'),
          });
        },
        'kiosk',
      );
    }),
  };
}

export default [routeKiosk('kiosk'), routeKiosk('kiosk/:category')];



// WEBPACK FOOTER //
// ./src/js/app/modules/kiosk/routes.js