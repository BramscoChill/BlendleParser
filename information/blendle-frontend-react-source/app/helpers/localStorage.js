export function setItem(key, value) {
  if (window.BrowserDetect.localStorageEnabled()) {
    window.localStorage.setItem(key, value);
  }
}

export function getItem(key) {
  if (window.BrowserDetect.localStorageEnabled()) {
    return window.localStorage.getItem(key);
  }

  return undefined;
}

export function removeItem(key) {
  if (window.BrowserDetect.localStorageEnabled()) {
    window.localStorage.removeItem(key);
  }
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/localStorage.js