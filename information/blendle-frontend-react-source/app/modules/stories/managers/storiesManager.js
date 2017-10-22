import axios from 'axios';
import Settings from 'controllers/settings';

export function fetchOverview(userId) {
  const url = Settings.getLink('b:user_stories', {
    user_id: userId,
  });

  return axios.get(url).then(resp => resp.data);
}



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/managers/storiesManager.js