import Settings from 'controllers/settings';
import axios from 'axios';

const PinsManager = {
  pinItem(user, itemId) {
    return this.updatePin(user, itemId, true);
  },

  unpinItem(user, itemId) {
    return this.updatePin(user, itemId, false);
  },

  updatePin(user, itemId, active) {
    return axios
      .put(Settings.getLink('user_pin', { user_id: user.id, item_id: itemId }), {
        pinned: active,
      })
      .then((response) => {
        if (active) {
          user.set('pins', user.get('pins') + 1);
        } else {
          user.set('pins', user.get('pins') - 1);
        }

        return response.data;
      });
  },
};

export default PinsManager;



// WEBPACK FOOTER //
// ./src/js/app/managers/pins.js