import Environment from 'environment';
import Cookies from 'cookies-js';

// Store events in localStorage during tests, so we can test if the correct events are sent
if (Environment.name === 'test') {
  window.__local_events = [];
  window.__trackLocal = function __trackLocal(events) {
    window.__local_events = [...window.__local_events, ...events];
  };

  window.__getLocalEvents = function __getLocalEvents(testEnvNumber) {
    return window.__local_events;
  };
}
export default {
  _session: null,
  _batches: {},
  _debounceTime: Environment.name === 'test' ? 0 : 250,

  /**
   * Set the current session
   * @param {String} session
   */
  setSession(session) {
    this._session = session;

    return session;
  },

  /**
   * Track the payload of proposed type. The payload should be a shallow object.
   * @param  {String} type
   * @param  {Object} payload
   */
  track(type, payload) {
    this.batch('_tracks', type, payload);

    clearTimeout(this._trackTimeout);

    this._trackTimeout = setTimeout(() => {
      this.sendBatch('_tracks').catch(() => null);
    }, this._debounceTime);
  },

  /**
   * Batch a track to a certain key so this can send events batched to the
   * server reducing the amount of requests send but increasing request size.
   * @param  {String} key
   * @param  {String} type
   * @param  {Object} payload
   * @return {Array}
   */
  batch(key, type, payload) {
    return this._appendToBatch(key, this._formatEvent(type, payload));
  },

  /**
   * Send the current batch under key and clear batch
   * @param  {String} key
   * @return {Promise}
   */
  sendBatch(key) {
    const batch = this.clearBatch(key);

    if (!batch) {
      return Promise.reject(new Error('No such batch'));
    }

    if (!batch.length) {
      return Promise.resolve(batch);
    }

    return this._send(batch).then(
      () => Promise.resolve(batch),
      (err) => {
        // Sentry
        window.ErrorLogger.captureException(err);

        // Add the failed batches as start of batch queue
        batch.reverse().forEach(this._prependToBatch.bind(null, key));

        return Promise.reject(new Error('Batch request failed'));
      },
    );
  },

  /**
   * Clear the batch under key and return batch
   * @param  {String} key
   * @return {Array}
   */
  clearBatch(key) {
    const batch = this.getBatch(key);

    delete this._batches[key];

    return batch;
  },

  getBatch(key) {
    return this._batches[key];
  },

  _appendToBatch(key, event) {
    const batch = this._ensureBatch(key);

    batch.push(event);

    return batch;
  },

  _prependToBatch(key, event) {
    const batch = this._ensureBatch(key);

    batch.splice(0, 0, event);

    return batch;
  },

  _ensureBatch(key) {
    let batch = this.getBatch(key);

    if (!batch) {
      batch = [];
      this._batches[key] = batch;
    }

    return batch;
  },

  _send(data) {
    if (window.__trackLocal && Environment.name === 'test') {
      window.__trackLocal(data);
    }

    if (!Environment.analytics) {
      return Promise.resolve();
    }

    // fixes circular injection issues
    const ByeBye = require('byebye');
    return ByeBye.ajax({
      url: Environment.analytics,
      type: 'POST',
      data: JSON.stringify(data),
    });
  },

  _formatEvent(type, payload) {
    return {
      type,
      session_id: this._session,
      origin: 'blendle.com',
      client_version: window._version,
      payload: payload || {},
    };
  },
};



// WEBPACK FOOTER //
// ./src/js/app/instances/blendalytics.js