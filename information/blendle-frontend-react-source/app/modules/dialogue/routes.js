import { history } from 'byebye';
import { get } from 'lodash';
import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('m-dialogue');
}

function onLeave() {
  document.body.classList.remove('m-dialogue');
}

export default [
  {
    module: 'dialogue',
    path: 'issue-acquired/:issueId',
    onEnter,
    onLeave,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          nextState.returnUrl = nextState.returnUrl || history.getPrevious(); // eslint-disable-line no-param-reassign
          const mod = require('./module');
          cb(null, {
            dialogue: () => mod.openIssueAcquired(nextState.params.issueId, nextState),
          });
        },
        'dialogue',
      );
    }),
  },
  {
    module: 'dialogue',
    path: 'unsubscribe-newsletter/:optOutType',
    onEnter,
    onLeave,
    requireAuth: false,
    getComponent: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          nextState.returnUrl = nextState.returnUrl || history.getPrevious(); // eslint-disable-line no-param-reassign
          const mod = require('./module');
          cb(null, {
            dialogue: () => mod.openUnsubscribeNewsletter(nextState.params.optOutType, nextState),
          });
        },
        'dialogue',
      );
    }),
  },
  {
    module: 'dialogue',
    path: 'premium-intro',
    onEnter,
    onLeave,
    requireAuth: false,
    getComponent: asyncRoute((nextState, cb) => {
      nextState.returnUrl =
        nextState.returnUrl ||
        get(nextState.location, 'state.returnUrl', null) ||
        history.getPrevious(); // eslint-disable-line no-param-reassign
      require.ensure(
        [],
        () => {
          const mod = require('./module');
          cb(null, {
            dialogue: () => mod.openPremiumTrialIntro(nextState),
          });
        },
        'dialogue',
      );
    }),
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/dialogue/routes.js