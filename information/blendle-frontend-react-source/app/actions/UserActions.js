import alt from 'instances/altInstance';
import UserManager from 'managers/users';
import PreferencesManager from 'managers/preferences';
import { XHR_STATUS } from 'app-constants';

export default alt.createActions({
  fetchUserDetails(userId) {
    UserManager.getUser(userId)
      .then((user) => {
        this.fetchUserDetailsSuccess({
          userId,
          data: user,
        });
      })
      .catch((err) => {
        if (err.type === XHR_STATUS && err.status === 404) {
          return this.fetchUserDetailsError({ userId });
        }
        throw err;
      });

    return { userId };
  },

  fetchUserDetailsSuccess: x => x,

  fetchUserDetailsError: x => x,

  updateUserPref(user, key, value) {
    const preferences = user.get('preferences');
    preferences[key] = value;

    PreferencesManager.save(user, preferences)
      .then(() => {
        this.updateUserPrefSuccess({ userId: user.id, key, value });
      })
      .catch((error) => {
        this.updateUserPrefError({ error });

        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return { userId: user.id, key, value };
  },

  updateUserPrefSuccess: x => x,

  updateUserPrefError: x => x,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/UserActions.js