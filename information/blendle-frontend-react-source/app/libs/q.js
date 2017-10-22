// Replaces Q with native Promises
// Goal is to remove Q eventually.

// Q docs: https://github.com/kriskowal/q/wiki/API-Reference
// Promises docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

/**
 * construct a new promise or simple resolve
 * @param {Promise|*} obj
 * @returns {Promise}
 */
export default function Q(obj) {
  if (obj instanceof Promise) {
    return obj;
  }
  return Promise.resolve(obj);
}

/**
 * Create or listen to a promise
 * @param {Promise|*} obj
 * @param {Function} [fulfilled]
 * @param {Function} [rejected]
 * @returns {Promise}
 */
Q.when = function (obj, fulfilled, rejected) {
  const promise = Q(obj);
  if (fulfilled || rejected) {
    return promise.then(fulfilled, rejected);
  }
  return promise;
};

/**
 * Defer a promise. Super deprecated.
 * @returns {Object} {
 * resolve: {Function},
 * reject: {Function},
 * promise: {Promise}
 * }
 */
Q.defer = function () {
  let resolve;
  let reject;
  const promise = new Promise((resolver, rejector) => {
    resolve = resolver;
    reject = rejector;
  });

  return { resolve, reject, promise };
};

/**
 * Implement a finally method on native promises.
 * The finalize function will always be called after a promise resolves/rejects.
 * @param {Function} fn
 * @returns {Promise}
 */
Promise.prototype.fin = function (fn) {
  return Q(this).then(fn, fn);
};



// WEBPACK FOOTER //
// ./src/js/app/libs/q.js