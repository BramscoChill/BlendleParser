import './polyfills/requestAnimationFrame';
import './polyfills/requestIdleCallback';
import './polyfills/classList';
import './polyfills/closest';

import 'core-js/es6/array';
import 'core-js/es7/array';
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es7/object';
import 'core-js/es6/string';
import 'core-js/es6/number';
import 'core-js/es6/function';
import 'core-js/es6/date';
import 'core-js/es6/promise';
import 'core-js/es6/map';
import 'core-js/es6/set';

if (!window.FontFaceObserver) {
  window.FontFaceObserver = require('./polyfills/fontfaceobserver');
}

if (!window.IntersectionObserver) {
  require('intersection-observer'); // eslint-disable-line global-require
}



// WEBPACK FOOTER //
// ./src/js/app/libs/polyfills.js