module.exports = (function () {
  const _ = require('lodash');
  const TypedError = require('helpers/typederror');
  const constants = require('app-constants');

  const RequestManager = {
    _requests: {},

    /**
     * Abort a request
     * @param  {String} keyToAbort
     */
    abort(keyToAbort) {
      RequestManager._requests = _.reduce(
        RequestManager._requests,
        (requests, request, key) => {
          if (!keyToAbort || keyToAbort === key) {
            request.abort && request.abort();

            return requests;
          }

          requests[key] = request;

          return requests;
        },
        {},
      );
    },

    /**
     * Get an existing request
     * @param  {String} key
     * @return {Promise}
     */
    get(key) {
      return RequestManager._requests[key];
    },

    /**
     * Set a reqeuest
     * @param {String} key
     * @param {Promise} request
     * @return {Promise}
     */
    set(key, request) {
      const currentRequest = RequestManager.get(key);

      if (currentRequest) {
        RequestManager.abort(key);
      }

      RequestManager._requests[key] = request;

      return request.then((resp) => {
        // If the requests isn't aborted, the request is checked again if it is really
        // the current request
        if (RequestManager.get(key) === request) {
          return Promise.resolve(resp);
        }

        return Promise.reject(new TypedError(constants.XHR_ABORT, 'Request has been aborted'));
      });
    },
  };

  return RequestManager;
}());



// WEBPACK FOOTER //
// ./src/js/app/managers/request.js