import React from 'react';
import { asyncRoute } from 'helpers/routerHelpers';

function onEnter() {
  document.body.classList.add('m-search');

  require.ensure(
    [],
    () => {
      const SearchActions = require('actions/SearchActions');
      SearchActions.setActive();
    },
    'search',
  );
}

function onLeave() {
  document.body.classList.remove('m-search');

  require.ensure(
    [],
    () => {
      const SearchActions = require('actions/SearchActions');
      SearchActions.setInactive();
    },
    'search',
  );
}

const modulePortalNavigationRoot = () => <div className="moduleNavigationPortalRoot" />;

function routeSearch(path) {
  return {
    module: 'search',
    path,
    onEnter,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            navigation: modulePortalNavigationRoot,
            content: require('./SearchContainer'),
          });
        },
        'search',
      );
    }),
  };
}

export default [routeSearch('search'), routeSearch('search/*')];



// WEBPACK FOOTER //
// ./src/js/app/modules/search/routes.js