import TypedError from 'helpers/typederror';
import { LIBRARY_UNAVAILABLE } from 'app-constants';

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const loader = document.createElement('script');
    loader.async = true;
    loader.src = url;

    loader.addEventListener(
      'load',
      (event) => {
        // Libs are attached to the window object in the next tick
        setTimeout(() => {
          resolve(event);
        });
      },
      false,
    );

    loader.addEventListener('error', reject, false);

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(loader, firstScript);
  });
}

export default class LibLoader {
  constructor(url, getLib) {
    this._url = url;
    this._getLib = getLib;
    this._loadPromise = null;
  }

  get lib() {
    return this._getLib();
  }

  load() {
    if (this._loadPromise) {
      return this._loadPromise;
    }

    this._loadPromise = loadScript(this._url).catch(() => {
      throw new TypedError(LIBRARY_UNAVAILABLE, `Unable to load library: ${this._url}`);
    });

    return this._loadPromise;
  }

  execute(method, ...args) {
    return this.load().then(() => this._getLib()[method](...args));
  }
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/libloader.js