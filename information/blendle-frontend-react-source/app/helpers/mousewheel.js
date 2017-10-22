/* eslint-disable */
module.exports = (function() {
  'use strict';

  // Global vars used for setup
  let prefix = '',
    addEventListenerMethod,
    removeEventListenerMethod,
    support,
    nullLowestDeltaTimeout,
    lowestDelta;

  // detect event model
  if (window.addEventListener) {
    addEventListenerMethod = 'addEventListener';
    removeEventListenerMethod = 'removeEventListener';
  } else {
    addEventListenerMethod = 'attachEvent';
    removeEventListenerMethod = 'detachEvent';
    prefix = 'on';
  }

  // Detect available wheel event
  support =
    'onwheel' in document.createElement('div')
      ? 'wheel' // Modern browsers support "wheel"
      : document.onmousewheel !== undefined
        ? 'mousewheel' // Webkit and IE support at least "mousewheel"
        : 'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

  function addEventListener(elem, callback, useCapture) {
    elem[addEventListenerMethod](prefix + support, callback, useCapture || false);
  }

  function removeEventListener(elem, callback, useCapture) {
    elem[removeEventListenerMethod](prefix + support, callback, useCapture || false);
  }

  // Normalize Delta
  function _nullLowestDelta() {
    lowestDelta = null;
  }

  function _shouldAdjustOldDeltas(absDelta) {
    // If this is an older event and the delta is divisable by 120,
    // then we are assuming that the browser is treating this as an
    // older mouse wheel event and that we should divide the deltas
    // by 40 to try and get a more usable deltaFactor.
    // Side note, this actually impacts the reported scroll distance
    // in older browsers and can cause scrolling to be slower than native.
    // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
    return absDelta % 120 === 0;
  }

  function normalizeDelta(event) {
    let delta = 0,
      deltaX = 0,
      deltaY = 0,
      absDelta = 0,
      offsetX = 0,
      offsetY = 0,
      normalizedDelta = {},
      target = event.currentTarget;

    // Old school scrollwheel delta
    if ('detail' in event) {
      deltaY = event.detail * -1;
    }
    if ('wheelDelta' in event) {
      deltaY = event.wheelDelta;
    }
    if ('wheelDeltaY' in event) {
      deltaY = event.wheelDeltaY;
    }
    if ('wheelDeltaX' in event) {
      deltaX = event.wheelDeltaX * -1;
    }

    // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
    if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
      deltaX = deltaY * -1;
      deltaY = 0;
    }

    // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
    delta = deltaY === 0 ? deltaX : deltaY;

    // New school wheel delta (wheel event)
    if ('deltaY' in event) {
      deltaY = event.deltaY * -1;
      delta = deltaY;
    }
    if ('deltaX' in event) {
      deltaX = event.deltaX;
      if (deltaY === 0) {
        delta = deltaX * -1;
      }
    }

    // No change actually happened, no reason to go any further
    if (deltaY === 0 && deltaX === 0) {
      return;
    }

    // Need to convert lines and pages to pixels if we aren't already in pixels
    // There are three delta modes:
    //   * deltaMode 0 is by pixels, nothing to do
    //   * deltaMode 1 is by lines
    //   * deltaMode 2 is by pages
    if (event.deltaMode === 1) {
      let lineHeight;

      if (target.offsetParent) {
        lineHeight = parseInt(window.getComputedStyle(target.offsetParent).fontSize, 10);
      } else {
        lineHeight = parseInt(window.getComputedStyle(document.body).fontSize, 10);
      }

      delta *= lineHeight;
      deltaY *= lineHeight;
      deltaX *= lineHeight;
    } else if (event.deltaMode === 2) {
      const pageHeight = event.currentTarget.offsetHeight;

      delta *= pageHeight;
      deltaY *= pageHeight;
      deltaX *= pageHeight;
    }

    // Store lowest absolute delta to normalize the delta values
    absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

    if (!lowestDelta || absDelta < lowestDelta) {
      lowestDelta = absDelta;

      // Adjust older deltas if necessary
      if (_shouldAdjustOldDeltas(event, absDelta)) {
        lowestDelta /= 40;
      }
    }

    // Adjust older deltas if necessary
    if (_shouldAdjustOldDeltas(event, absDelta)) {
      // Divide all the things by 40!
      delta /= 40;
      deltaX /= 40;
      deltaY /= 40;
    }

    // Get a whole, normalized value for the deltas
    delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
    deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
    deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

    // Normalise offsetX and offsetY properties
    if (event.currentTarget.getBoundingClientRect) {
      const boundingRect = event.currentTarget.getBoundingClientRect();
      offsetX = event.clientX - boundingRect.left;
      offsetY = event.clientY - boundingRect.top;
    }

    // Add information to the event object
    normalizedDelta.deltaX = deltaX;
    normalizedDelta.deltaY = deltaY;
    normalizedDelta.deltaFactor = lowestDelta;
    normalizedDelta.offsetX = offsetX;
    normalizedDelta.offsetY = offsetY;
    // Go ahead and set deltaMode to 0 since we converted to pixels
    // Although this is a little odd since we overwrite the deltaX/Y
    // properties with normalized deltas.
    normalizedDelta.deltaMode = 0;

    // Clearout lowestDelta after sometime to better
    // handle multiple device types that give different
    // a different lowestDelta
    // Ex: trackpad = 3 and mouse wheel = 120
    if (nullLowestDeltaTimeout) {
      clearTimeout(nullLowestDeltaTimeout);
    }
    nullLowestDeltaTimeout = setTimeout(_nullLowestDelta, 200);

    return normalizedDelta;
  }

  const Mousewheel = {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    normalize: normalizeDelta,
  };

  return Mousewheel;
})();



// WEBPACK FOOTER //
// ./src/js/app/helpers/mousewheel.js