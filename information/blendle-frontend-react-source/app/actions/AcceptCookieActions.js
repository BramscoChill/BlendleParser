import alt from 'instances/altInstance';
import CookieBarManager from 'managers/cookiebar';

export default alt.createActions({
  cookieBarClosed: () => {
    CookieBarManager.cookieBarClosed = true;
    return { cookieBarClosed: true };
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/AcceptCookieActions.js