if ('serviceWorker' in navigator) {
  // Hold my beer, I know what I'm doing here
  /* eslint-disable compat/compat */
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
  /* eslint-enable */
}



// WEBPACK FOOTER //
// ./src/js/app/services/serviceworker/enable.js