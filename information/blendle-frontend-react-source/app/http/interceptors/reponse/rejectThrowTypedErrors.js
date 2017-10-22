import TypedError from 'helpers/typederror';
import { XHR_STATUS, XHR_ERROR } from 'app-constants';

/**
 * rethrow the errors as an TypedError for better error handling
 * @param err
 */
export default function (err) {
  // axios adds an config property to all errors
  if (!err.config) {
    throw err;
  }

  const message = err.message || err.data.message;
  const type = err.status >= 500 || err.status === 0 ? XHR_ERROR : XHR_STATUS;

  const data = {
    ...err,
    xhr: err.config,
  };

  throw new TypedError(type, message, data);
}



// WEBPACK FOOTER //
// ./src/js/app/http/interceptors/reponse/rejectThrowTypedErrors.js