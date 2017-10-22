import browserHistory from 'react-router/lib/browserHistory';
import URI from 'urijs';

let replace = false;
let previousURL = null;
let currentURL = null;
browserHistory.listenBefore(() => {
  if (!replace) {
    previousURL = currentURL;
  }

  replace = false;
});
browserHistory.listen((url) => {
  currentURL = url;
});

export default {
  on(event, handler) {
    if (event === 'route') {
      return browserHistory.listen(handler);
    }
    throw new Error('Undefined event');
  },

  loadUrl(path) {
    return browserHistory.replace(path || currentURL.pathname);
  },

  navigate(path, options = {}, state = {}) {
    let data = {};

    if (typeof path === 'string') {
      data.pathname = path;
    } else {
      data = path;
    }

    if (!data.pathname.startsWith('/')) {
      data.pathname = `/${data.pathname}`;
    }

    setTimeout(() => {
      if (options.trigger) {
        if (options.replace) {
          replace = true;
          return browserHistory.replace({ ...data, state });
        }
        return browserHistory.push({ ...data, state });
      }
      if (options.replace) {
        return history.replaceState(null, null, data.pathname);
      }
      return browserHistory.createLocation(data.pathname, 'PUSH');
    });
  },

  back() {
    return browserHistory.goBack();
  },

  getCurrent() {
    return currentURL;
  },

  getPrevious() {
    return previousURL ? previousURL.pathname : '';
  },

  getPreviousAsObject() {
    return previousURL;
  },

  getFragment() {
    return currentURL.pathname;
  },

  getQueryParameters() {
    const uri = new URI(currentURL);
    const params = uri.search(true);

    if (Object.keys(params).length === 0) {
      return undefined;
    }
    return params;
  },

  get fragment() {
    return this.getFragment();
  },
};



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/history.js