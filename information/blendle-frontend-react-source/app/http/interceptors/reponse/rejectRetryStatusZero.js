/**
 * Retry requests that fail with status 0. Only rerun them once, and then throw the error.
 * Some of the common situations that produce statusCode 0 could be any or none of these problems:
 * - Illegal cross origin request (see CORS)
 * - Firewall block or filtering
 * - The request itself was cancelled in code
 * - An installed browser extension is mucking things up
 * link: http://stackoverflow.com/a/14507670/1346170
 *
 * @param {function} ajaxFactory
 * @param err
 * @returns {*}
 */

const COUNT_KEY = '__retryCount';
const MAX_RETRIES = 3;

export default function (ajaxFactory, err) {
  if (err.config) {
    const retryCount = err.config[COUNT_KEY] || 0;
    const isErrorStatus = err.status === 0 || err.status === 503;
    const isNetworkError = err.message === 'Network Error';

    if (retryCount + 1 < MAX_RETRIES && (isErrorStatus || isNetworkError)) {
      err.config[COUNT_KEY] = retryCount + 1;
      return ajaxFactory(err.config);
    }
  }

  throw err;
}



// WEBPACK FOOTER //
// ./src/js/app/http/interceptors/reponse/rejectRetryStatusZero.js