/* eslint-disable */

/**
 * requestAnimationFrame version: "0.0.23" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/requestAnimationFrame for details
 *
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * requestAnimationFrame polyfill by Erik M�ller. fixes from Paul Irish and Tino Zijdel
 * MIT license
 *
 */
(function(global) {
  if (global.requestAnimationFrame) {
    return;
  }

  if (global.webkitRequestAnimationFrame) {
    // Chrome <= 23, Safari <= 6.1, Blackberry 10
    global.requestAnimationFrame = global['webkitRequestAnimationFrame'];
    global.cancelAnimationFrame =
      global['webkitCancelAnimationFrame'] || global['webkitCancelRequestAnimationFrame'];
    return;
  }

  // IE <= 9, Android <= 4.3, very old/rare browsers
  let lastTime = 0;
  global.requestAnimationFrame = function(callback) {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16 - (currTime - lastTime));
    const id = global.setTimeout(function() {
      callback(currTime + timeToCall);
    }, timeToCall);

    lastTime = currTime + timeToCall;
    return id; // return the id for cancellation capabilities
  };

  global.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
})(window);



// WEBPACK FOOTER //
// ./src/js/app/libs/polyfills/requestAnimationFrame.js