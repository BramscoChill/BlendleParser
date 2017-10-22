export function getBaseUrl() {
  const port = window.location.port ? `:${window.location.port}` : '';

  return `${window.location.protocol}//${window.location.hostname}${port}`;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/baseUrl.js