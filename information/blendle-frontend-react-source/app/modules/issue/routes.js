import React from 'react';
import { asyncRoute } from 'helpers/routerHelpers';
import { isProviderHidden, prefillSelector } from 'selectors/providers';

function onEnter(nextState, replace) {
  document.body.classList.add('m-issue');

  require.ensure(
    [],
    () => {
      const IssueActions = require('actions/IssueActions');
      IssueActions.changeVisibility.defer(true);
    },
    'kiosk',
  );

  if (prefillSelector(isProviderHidden)(nextState.params.providerId)) {
    replace('/404');
  }
}

function onLeave() {
  document.body.classList.remove('m-issue');

  require.ensure(
    [],
    () => {
      const IssueActions = require('actions/IssueActions');
      IssueActions.changeVisibility.defer(false);
    },
    'kiosk',
  );
}

const modulePortalNavigationRoot = () => <div className="moduleNavigationPortalRoot" />;

function routeIssue(path) {
  return {
    module: 'issue',
    path,
    onEnter,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            content: require('./containers/IssueRouterContainer'),
            navigation: modulePortalNavigationRoot,
          });
        },
        'kiosk',
      ); // named kiosk, the issue and kiosk modules are most likely to used together
    }),
  };
}

export default [
  routeIssue('issue/:providerId'),
  routeIssue('issue/:providerId/:issueId'),
  routeIssue('issue/:providerId/:issueId/:section'),
  routeIssue('issue/:providerId/:issueId/manifest/:itemId'),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/routes.js