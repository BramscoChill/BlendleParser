/**
 * filter falsy headers, so they won't get send with the XHR call
 * @param requestConfig
 * @returns {{headers: *}}
 */
export default function (requestConfig) {
  const src = requestConfig.headers;
  const result = Object.keys(src).reduce((obj, key) => {
    if (src[key]) {
      obj[key] = src[key];
    }
    return obj;
  }, {});

  return {
    ...requestConfig,
    headers: result,
  };
}



// WEBPACK FOOTER //
// ./src/js/app/http/interceptors/request/filterFalsyHeaders.js