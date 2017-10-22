import alt from 'instances/altInstance';
import authController from 'controllers/auth';
import Settings from 'controllers/settings';
import axios from 'axios';
import User from 'models/user';

function getMe() {
  return axios
    .get(Settings.getLink('me'))
    .then(response => new User(response.data, { parse: true }));
}

function ensureActiveSubscription(user) {
  if (user.get('active_subscriptions')) {
    return Promise.resolve(user);
  }

  if (Settings.settingsFetched()) {
    return getMe();
  }

  return new Promise((resolve) => {
    function callback() {
      getMe().then(resolve);
      Settings.off('sync', callback);
    }

    Settings.on('sync', callback);
  });
}

// These actions are triggered by the Auth controller's listen event.
export default alt.createActions({
  authenticateUser(user) {
    return (dispatch) => {
      ensureActiveSubscription(user).then(newuser => dispatch(newuser));
    };
  },

  logout() {
    if (authController.getToken()) {
      authController.logout();
    }

    return null;
  },

  update(user) {
    return (dispatch) => {
      ensureActiveSubscription(user).then(newuser => dispatch(newuser));
    };
  },

  fetchUser() {
    getMe().then(user => this.fetchUserSuccess(user));

    return null;
  },

  fetchUserSuccess: x => x,

  userInputChange: user => user,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/AuthActions.js