import { INVALID_TOKEN, NO_TOKEN } from 'app-constants';

// contains the promise of renew JWT token
let renewTokenRequestPromise = null;

/**
 * requests a new requestToken, and will retry the error afterwards
 * @param {function} ajaxFactory
 * @param requestConfig
 * @returns {*}
 */
function renewTokenAndRetryRequest(ajaxFactory, requestConfig) {
  const auth = require('controllers/auth');

  // we use only one renew promise, so all the failing requests will only fire one renew request.
  if (!renewTokenRequestPromise) {
    renewTokenRequestPromise = auth.renewJWT();
  }
  return renewTokenRequestPromise
    .then(() => {
      const config = {
        ...requestConfig,
        skipJWTRefresh: true,
      };

      renewTokenRequestPromise = null;

      // Delete the previous Authorization header, so the updated JWT requestToken will be send
      // in the new request
      delete config.headers.Authorization;

      return ajaxFactory(config);
    })
    .catch((err) => {
      if (err.type === INVALID_TOKEN) {
        const Analytics = require('instances/analytics');
        Analytics.track('JWT Expired', { type: 'renew' });
      }
      if (err.type === INVALID_TOKEN || err.type === NO_TOKEN) {
        return auth.logout();
      }
      throw err;
    });
}

/**
 * When a JWT is expired, we will try to get a new one. Used as an axios interceptor
 * @param {function} ajaxFactory
 * @param {Error} err
 * @returns {Promise}
 */
export default function (ajaxFactory, err) {
  const auth = require('controllers/auth');
  if (auth.getToken() && err.status === 401 && !err.config.skipJWTRefresh) {
    return renewTokenAndRetryRequest(ajaxFactory, err.config);
  }
  throw err;
}



// WEBPACK FOOTER //
// ./src/js/app/http/interceptors/reponse/rejectExpiredJWT.js