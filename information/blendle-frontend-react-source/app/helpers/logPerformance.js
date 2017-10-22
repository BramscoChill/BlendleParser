import Analytics from 'instances/analytics';
import features from 'config/features';

/**
 * Log the performance timing to the console and analytics.
 * @param {String} event
 * @param {Object} [payload={}]
 * @param {Number} [startTime=window__perfInitTime__], a Date.now()-like number
 */
function logPerf(event, payload = {}, startTime = window.__perfInitTime) {
  payload.event = event;
  payload.timing = Date.now() - startTime;

  if (process.env.NODE_ENV === 'development') {
    console.info(
      '%cPerf',
      'color: #2E97D0; padding: 3px; display: block; background: #D6EBFF; font-size: 90%;',
      payload,
    );
  }

  if (features.trackPerformance) {
    Analytics.trackPerformance(payload);
  }

  const newrelic = window.newrelic;
  if (newrelic && newrelic.addToTrace) {
    newrelic.addToTrace({
      name: event,
      start: startTime,
      end: payload.timing,
      origin: payload.view,
    });
  }
}

// keeps track of the events that are only supposed to be triggered once
const onceHistory = {};

/**
 * Send a message only once, unique by message string
 * @param {String} event
 */
logPerf.once = function (event, payload) {
  if (onceHistory[event]) {
    return;
  }
  logPerf(event, payload);
  onceHistory[event] = true;
};

// predefined logs
logPerf.applicationBooting = function () {
  logPerf.once('Application Booting');
};

logPerf.applicationRunning = function () {
  logPerf.once('Application Running');
};

logPerf.applicationReady = function (view) {
  logPerf.once('Application Ready', { view });
};

logPerf.readerReady = function (startTime) {
  logPerf('Reader Ready', {}, startTime);
};

module.exports = logPerf;



// WEBPACK FOOTER //
// ./src/js/app/helpers/logPerformance.js