/**
 * Send cookies to the mocking server
 */
export default function setTestCookie(requestConfig) {
  requestConfig.withCredentials = true;
  return requestConfig;
}



// WEBPACK FOOTER //
// ./src/js/app/http/interceptors/request/setTestScenarioCookie.js