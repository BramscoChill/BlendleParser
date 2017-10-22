import { isFunction } from 'lodash';
import axios from 'axios';
import Backbone from 'backbone';
import Environment from 'environment';
import setAuthorizationHeader from 'http/interceptors/request/setAuthorizationHeader';
import filterFalsyHeaders from 'http/interceptors/request/filterFalsyHeaders';
import setTestScenarioCookie from 'http/interceptors/request/setTestScenarioCookie';
import legacyResponseObject from 'http/interceptors/reponse/legacyResponseObject';
import rejectExpiredJWT from 'http/interceptors/reponse/rejectExpiredJWT';
import rejectThrowTypedErrors from 'http/interceptors/reponse/rejectThrowTypedErrors';
import rejectRetryStatusZero from 'http/interceptors/reponse/rejectRetryStatusZero';

/**
 * @param {Object} legacyOptions
 * @returns {Object} legacy
 */
function convertLegacyOptions(legacyOptions) {
  const options = {
    headers: {},
    ...legacyOptions,
  };

  if (legacyOptions.type) {
    options.method = legacyOptions.type.toLowerCase();
  }
  if (legacyOptions.accept !== undefined) {
    options.headers.Accept = legacyOptions.accept;
  }
  if (legacyOptions.contentType !== undefined) {
    options.headers['Content-Type'] = legacyOptions.contentType;
  }
  return options;
}

/**
 * Ajax function, as implemented by Backbone
 * @param {Object} config
 * @returns {Promise} request
 */
function ajaxFactory(config) {
  const request = axios(convertLegacyOptions(config));

  // legacy success option
  if (isFunction(config.success)) {
    return request.then(config.success);
  }
  return request;
}

// Set as default Backbone ajax lib
Backbone.ajax = ajaxFactory;

// set default content-type header to json instead of `application/x-www-form-urlencoded`
Object.keys(axios.defaults.headers).forEach((method) => {
  axios.defaults.headers[method] = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
  };
});

axios.interceptors.request.use(filterFalsyHeaders);
axios.interceptors.request.use(setAuthorizationHeader);

axios.interceptors.response.use(
  legacyResponseObject(Promise.resolve.bind(Promise)),
  legacyResponseObject(Promise.reject.bind(Promise)),
);
axios.interceptors.response.use(undefined, rejectThrowTypedErrors);
axios.interceptors.response.use(undefined, rejectExpiredJWT.bind(null, ajaxFactory));
axios.interceptors.response.use(undefined, rejectRetryStatusZero.bind(null, ajaxFactory));

if (Environment.name === 'test') {
  axios.interceptors.request.use(setTestScenarioCookie);
}

export default ajaxFactory;



// WEBPACK FOOTER //
// ./src/js/app/http/ajax.js