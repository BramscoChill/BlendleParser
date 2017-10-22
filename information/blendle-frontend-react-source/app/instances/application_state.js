import ByeBye from 'byebye';
import Cookies from 'cookies-js';

const ApplicationState = ByeBye.Model.extend({
  defaults: {
    moduleStack: [],
  },

  _cookieName: 'application_state',

  saveToCookie(cookieName) {
    cookieName = cookieName || this._cookieName;

    Cookies.set(cookieName, JSON.stringify(this.toJSON()));
  },

  loadFromCookie(cookieName) {
    cookieName = cookieName || this._cookieName;

    if (Cookies.get(cookieName)) {
      this.set(JSON.parse(Cookies.get(cookieName)));

      this.removeCookie(cookieName);
    }
  },

  removeCookie(cookieName) {
    cookieName = cookieName || this._cookieName;

    Cookies.expire(cookieName);
  },
});

export default new ApplicationState();



// WEBPACK FOOTER //
// ./src/js/app/instances/application_state.js