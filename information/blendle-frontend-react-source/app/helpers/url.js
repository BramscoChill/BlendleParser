import { locale as i18n } from 'instances/i18n';
import URI from 'urijs';
import { sprintf } from 'sprintf-js';

export function uri2url(uri, host, protocol) {
  return sprintf(
    '%s//%s/%s',
    protocol || window.location.protocol,
    host || window.location.host,
    uri,
  );
}

export function param(object) {
  return Object.keys(object)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(object[k])}`)
    .join('&');
}

export function getParams(options = { useSearch: false }) {
  const params = {};
  const queryString = (options.useSearch ? window.location.search : window.location.hash).substring(
    1,
  );

  const regex = /([^&=]+)=([^&]*)/g; // Match the text before and after the equals (=) sign in groups
  let match = regex.exec(queryString);

  while (match) {
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    match = regex.exec(queryString);
  }

  return params;
}

export function getUTMParameters() {
  const urlParams = URI.parseQuery(window.location.search);
  const utmParams = {};

  if (urlParams.utm_ref || urlParams.ref) {
    utmParams.referrer = urlParams.utm_ref || urlParams.ref;
  }

  if (urlParams.utm_source || urlParams.source) {
    utmParams.source = urlParams.utm_source || urlParams.source;
  }

  if (urlParams.utm_medium || urlParams.medium) {
    utmParams.medium = urlParams.utm_medium || urlParams.medium;
  }

  if (urlParams.utm_campaign || urlParams.campaign) {
    utmParams.campaign = urlParams.utm_campaign || urlParams.campaign;
  }

  if (urlParams.utm_content || urlParams.content) {
    utmParams.content = urlParams.utm_content || urlParams.content;
  }

  if (urlParams.utm_term || urlParams.term) {
    utmParams.term = urlParams.utm_term || urlParams.term;
  }

  return utmParams;
}

export function removeTrailingSlash(url = '', replace = false) {
  const splitted = url.split('?');
  splitted[0] = splitted[0].replace(/\/$/, '');
  url = splitted.join('?');

  if (replace && i18n.app) {
    window.history.replaceState({}, i18n.app.text.page_title, url);
  }

  return url;
}

// rewrite urls like "blendle.com/#item/1337" to "blendle.com/item/1337"
export function redirectLegacyHashUrl(href) {
  const url = new URI(href);
  if (url.fragment() && url.pathname() === '/') {
    url.pathname(url.fragment());
    url.hash('');
    window.location = url.toString();
  }
}

export function removeProtocol(str = '') {
  return str.replace(/^https?:\/\//, '');
}

export function getTrackingURL(location = {}) {
  const { pathname, search, hash } = location;

  return [pathname, search, hash].join('');
}

export function getPathname(href) {
  return new URI(href).pathname();
}

// Replace the last path in the given url
// /getpremium/item/123123/login -> /getpremium/item/123123/signup
export function replaceLastPath(pathname, replacement) {
  return removeTrailingSlash(pathname.replace(/\/[^/]*$/, `/${replacement}`));
}

export function removeOrigin(url) {
  const origin = new URI(url).origin();

  return url.replace(origin, '');
}

/**
 * @param {string} nextPath the following path to go to
 * @param {string} currentPath the current path, mostly window.location.pathname
 * @returns {boolean} is the following path some kind of a family route
 */
export function isFamilyPath(nextPath, currentPath) {
  const isSubroute = nextPath.startsWith(currentPath);
  const parentRoute = replaceLastPath(nextPath, '');
  const isParentRoute = currentPath.startsWith(parentRoute);
  const currentParentRoute = replaceLastPath(currentPath, '');
  const isSisterRoute = parentRoute.startsWith(currentParentRoute);
  return isSubroute || isParentRoute || isSisterRoute;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/url.js