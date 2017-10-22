module.exports = (function () {
  const _ = require('lodash');

  const TypedError = function (type, message, data) {
    const error = new Error(message);

    if (data) {
      _.extend(error, data);
    }

    error.type = type;

    return error;
  };

  return TypedError;
}());



// WEBPACK FOOTER //
// ./src/js/app/helpers/typederror.js