import 'libs/polyfills';
import Environment from 'environment';
import Settings from 'controllers/settings';
import Backbone from 'backbone';
import Q from 'q';
import logPerformance from 'helpers/logPerformance';
import { removeTrailingSlash, redirectLegacyHashUrl } from 'helpers/url';
import React from 'react';
import ReactDOM from 'react-dom';
import RootContainer from 'containers/RootContainer';
import './services/serviceworker/enable';

// log JS ready performance
logPerformance.applicationBooting();

// Override Deferred so we won't be using the jQuery variant
Backbone.Deferred = () => Q.defer();

Settings.url = Environment.api;

// Remove any trailing slash from the url
removeTrailingSlash(document.location.href, true);
redirectLegacyHashUrl(document.location.href);

ReactDOM.render(<RootContainer />, document.querySelector('#application'));

// helper function for settings the scenario of our mock server
if (process.env.NODE_ENV === 'development' || Environment.name === 'test') {
  window.mockScenario = (scenario, options = {}) => {
    document.cookie = `testScenario=${scenario}; path=/`;
    Object.keys(options).forEach((key) => {
      document.cookie = `${key}=${options[key]}; path=/`;
    });
  };
}

// import all stores so no actions will be lost
// dont import sub folders to prevent mocks be imported in production build
const requireStores = require.context('./stores/', false, /\.js$/);
requireStores.keys().forEach(requireStores);



// WEBPACK FOOTER //
// ./src/js/app/index.js