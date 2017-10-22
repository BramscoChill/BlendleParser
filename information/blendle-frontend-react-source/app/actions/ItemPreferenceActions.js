import alt from 'instances/altInstance';
import axios from 'axios';
import Settings from 'controllers/settings';
import Analytics from 'instances/analytics';

class ItemPreferenceActions {
  fetchPreference(userId, itemId) {
    axios
      .get(
        Settings.getLink('user_item_preference', {
          user_id: userId,
          item_id: itemId,
        }),
      )
      .then((res) => {
        this.fetchPreferenceSuccess({ itemId, data: res.data });
      })
      .catch((error) => {
        this.fetchPreferenceSuccess({ itemId, error });
      });

    return { userId, itemId };
  }

  fetchPreferenceSuccess = x => x;
  fetchPreferenceError = x => x;

  sendNegativePreference(userId, itemId, analytics) {
    axios
      .post(
        Settings.getLink('user_item_preference', {
          user_id: userId,
          item_id: itemId,
        }),
      {
        prefer: 'less',
      },
      )
      .then((res) => {
        this.sendNegativePreferenceSuccess({ itemId, data: res.data });

        Analytics.track('Feedback Sent', {
          item_id: itemId,
          prefer: 'less',
          internal_location: 'item',
          location_in_layout: 'end-of-reader',
          feedback_on: 'item',
          ...analytics,
        });
      })
      .catch((error) => {
        this.sendNegativePreferenceError({ itemId, error });
      });

    return { userId, itemId };
  }

  sendNegativePreferenceSuccess = x => x;
  sendNegativePreferenceError = x => x;

  deleteNegativePreference(userId, itemId) {
    axios
      .delete(
        Settings.getLink('user_item_preference', {
          user_id: userId,
          item_id: itemId,
        }),
      )
      .then((res) => {
        this.deleteNegativePreferenceSuccess({ itemId, data: res.data });

        Analytics.track('Feedback Sent', {
          item_id: itemId,
          prefer: 'reset',
          internal_location: 'item',
          location_in_layout: 'end-of-reader',
          feedback_on: 'item',
        });
      })
      .catch((error) => {
        this.deleteNegativePreferenceError({ itemId, error });
      });

    return { userId, itemId };
  }

  deleteNegativePreferenceSuccess = x => x;
  deleteNegativePreferenceError = x => x;
}

export default alt.createActions(ItemPreferenceActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ItemPreferenceActions.js