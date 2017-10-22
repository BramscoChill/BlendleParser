import axios from 'axios';
import Settings from 'controllers/settings';
import URI from 'urijs';
import { get } from 'lodash';

const ZOOM = 'b:tiles';

export function fetchAlerts(userId) {
  return axios
    .get(Settings.getLink('alerts', { user_id: userId }, { amount: 100, page: 1 }), {
      headers: {
        accept: 'application/hal+json',
      },
    })
    .then(response => response.data);
}

export function fetchResults(url) {
  const uri = new URI(url).addSearch('zoom', ZOOM);

  return axios
    .get(uri.toString(), {
      headers: {
        accept: 'application/hal+json',
        'X-Tile-Version': 3, // Use new tile endpoint version
      },
    })
    .then(response => ({
      tiles: get(response, 'data._embedded[b:tiles]', []),
      next: response.data._links.next ? response.data._links.next.href : null,
    }));
}

export function tryAlert(query) {
  const url = Settings.getLink('item_search', { query }, [ZOOM]);

  return axios
    .get(url, {
      headers: {
        accept: 'application/hal+json',
        'X-Tile-Version': 3, // Use new tile endpoint version
      },
    })
    .then(response => ({
      tiles: get(response, 'data._embedded[b:tiles]', []),
      next: response.data._links.next ? response.data._links.next.href : null,
    }));
}

export function addAlert(userId, keyword) {
  return axios.post(Settings.getLink('alerts', { user_id: userId }), {
    query: keyword.toLowerCase(),
  });
}

export function deleteAlert(url) {
  return axios.delete(url);
}

export function editAlert(url, newValues) {
  return axios.put(url, {
    ...newValues,
  });
}



// WEBPACK FOOTER //
// ./src/js/app/managers/alerts.js