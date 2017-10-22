const STORAGE_KEY = '__SESSION_STORAGE';

function getStorage() {
  if (window.BrowserDetect.localStorageEnabled()) {
    return window.sessionStorage;
  }
  if (!window[STORAGE_KEY]) {
    window[STORAGE_KEY] = {};
  }
  return window[STORAGE_KEY];
}

export function setItem(key, value) {
  getStorage()[key] = value.toString();
}

export function getItem(key) {
  return getStorage()[key];
}

export function removeItem(key) {
  const storage = getStorage();
  delete storage[key];
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/sessionStorage.js