import alt from 'instances/altInstance';
import AcceptCookieActions from 'actions/AcceptCookieActions';
import CookieBarManager from 'managers/cookiebar';

class AcceptCookieStore {
  constructor() {
    this.bindActions(AcceptCookieActions);

    this.state = {
      cookieBarClosed: CookieBarManager.cookieBarClosed,
    };
  }

  onCookieBarClosed(payload) {
    this.setState(payload);
  }
}

export default alt.createStore(AcceptCookieStore, 'AcceptCookieStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/AcceptCookieStore.js