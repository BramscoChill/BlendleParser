import { get } from 'axios';
import Settings from 'controllers/settings';

export default function fetchTimeZones() {
  return get(Settings.getLink('time_zones')).then(resp => resp.data.time_zones);
}



// WEBPACK FOOTER //
// ./src/js/app/managers/settings.js