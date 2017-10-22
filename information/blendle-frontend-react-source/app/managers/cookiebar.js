import { setItem, getItem } from 'helpers/localStorage';

const cookieBar = {
  positive: 'yes',
  negative: 'no',
  storageKey: 'cookie_bar_closed',

  get cookieBarClosed() {
    return getItem(this.storageKey) === this.positive;
  },

  set cookieBarClosed(state) {
    const stateForStorage = state ? this.positive : this.negative;
    return setItem(this.storageKey, stateForStorage);
  },
};

export default cookieBar;



// WEBPACK FOOTER //
// ./src/js/app/managers/cookiebar.js