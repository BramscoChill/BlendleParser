import { asyncRoute } from 'helpers/routerHelpers';
import AuthStore from 'stores/AuthStore';
import hasPrivateLabAccess from 'helpers/hasPrivateLabAccess';
import { deepDivesEnabled } from 'selectors/labExperiments';

const route = (path, getComponent) => ({
  module: 'deepdives',
  path,
  getComponent,
  onEnter: (nextState, replace) => {
    const { user } = AuthStore.getState();

    document.body.classList.add('m-deepdives');

    if (!hasPrivateLabAccess(user) || !deepDivesEnabled()) {
      replace('/');
    }
  },
  onLeave: () => {
    document.body.classList.remove('m-deepdives');
  },
});

const deepDivesRoute = path =>
  route(
    path,
    asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./containers/DeepDivesContainer'),
          });
        },
        'deepdives',
      );
    }),
  );

const deepDiveRoute = path =>
  route(
    path,
    asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./containers/DeepDiveContainer'),
          });
        },
        'deepdives',
      );
    }),
  );

export default [deepDivesRoute('deepdives'), deepDiveRoute('deepdive/:deepDiveId')];



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/routes.js