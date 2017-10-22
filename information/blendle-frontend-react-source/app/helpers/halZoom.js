import axios from 'axios';

function fetchResource(url) {
  return axios.get(url, {
    headers: {
      accept: 'application/hal+json',
    },
  });
}

/**
 * zoom link and enhance the halObject with the zoomed data.
 * @param {Object} halObject
 * @param {String} linkName
 * @param {Function} [customFetch=axios.get]
 * @returns {Promise}
 */
export function halZoom(halObject, linkName, customFetch) {
  const links = halObject._links;
  const embedded = halObject._embedded;

  // already available or link isn't found (should reject?)
  if (embedded[linkName] || !links[linkName]) {
    return Promise.resolve(halObject);
  }

  // skip links to self
  const href = links[linkName].href;
  if (href === links.self.href) {
    return Promise.resolve(halObject);
  }

  const fetch = customFetch || fetchResource;
  return fetch(href).then((response) => {
    embedded[linkName] = response.data;
    return halObject;
  });
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/halZoom.js