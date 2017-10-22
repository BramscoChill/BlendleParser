import alt from 'instances/altInstance';
import Analytics from 'instances/analytics';
import axios from 'axios';
import Settings from 'controllers/settings';
import Auth from 'controllers/auth';
import { get } from 'lodash';

export default alt.createActions({
  redeem(code) {
    let [gift_card_id, pin] = code.split('-');
    if (!pin) {
      [gift_card_id, pin] = code.split(' ');
    }

    if (!pin) {
      // user did not separate barcode and pin
      gift_card_id = code.substr(0, 19);
      pin = code.substr(19);
    }

    axios
      .post(Settings.getLink('orders'), { gift_card_id, pin })
      .then(resp => Auth.renewJWT().then(() => Promise.resolve(resp)))
      .then(this.redeemSuccess)
      .catch(this.redeemError);

    return null;
  },

  redeemSuccess(resp) {
    Analytics.track('Redeem Gift: Success');
    return resp;
  },

  redeemError(error) {
    const reason = get(error, 'data._errors[0].message') || error.message;
    Analytics.track('Redeem Gift: Failed', { reason });

    return error;
  },

  setCode(code) {
    if (code === '') {
      return null;
    }

    return code;
  },

  setFocus(isFocussed) {
    return { isFocussed };
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/GiftActions.js