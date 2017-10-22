// https://developers.google.com/web/updates/2015/08/using-requestidlecallback
window.requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(cb) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function cancelIdleCallback(id) {
    clearTimeout(id);
  };



// WEBPACK FOOTER //
// ./src/js/app/libs/polyfills/requestIdleCallback.js