import axios from 'axios';
import URI from 'urijs';
import Settings from 'controllers/settings';

export function fetchPersonalPage(userId) {
  const url = Settings.getLink('b:user_home', {
    user_id: userId,
  });

  return axios
    .get(url, {
      headers: {
        accept: 'application/hal+json',
      },
    })
    .then(resp => resp.data);
}

export function fetchTiles(url) {
  const requestUrl = URI(url)
    .addSearch('zoom', 'b:tiles')
    .toString();

  return axios
    .get(requestUrl, {
      headers: {
        accept: 'application/hal+json',
        'X-Tile-Version': 3,
      },
    })
    .then(resp => resp.data);
}



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/managers/sectionsPageManager.js