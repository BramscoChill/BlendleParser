export default handler => (result) => {
  const response = result.response || {};
  const request = result.request || {};

  return handler(
    Object.assign(result, {
      data: result.data || response.data || {},
      status: response.status || request.status || 0,
    }),
  );
};



// WEBPACK FOOTER //
// ./src/js/app/http/interceptors/reponse/legacyResponseObject.js