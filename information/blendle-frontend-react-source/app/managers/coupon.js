import axios from 'axios';
import {
  COUPON_INVALID,
  COUPON_REDEEMED,
  COUPON_EXPIRED,
  COUPON_EXCEEDED_MAX,
  COUPON_NEW_USERS_ONLY,
  COUPON_CAMPAIGN_EXPIRED,
  COUPON_PRODUCT_ERROR,
} from 'app-constants';
import Settings from 'controllers/settings';
import Auth from 'controllers/auth';
import TypedError from 'helpers/typederror';

/**
 * Validate a given couponcode
 * @param  {String} couponCodeStr
 * @return {Promise}
 */
export function validateCoupon(couponCodeStr) {
  return axios({
    url: Settings.getLink('verify_coupon', { code: couponCodeStr }),
    method: 'get',
  })
    .then((res) => {
      if (res.data.only_new_accounts && Auth.getUser()) {
        return Promise.reject(new TypedError(COUPON_NEW_USERS_ONLY));
      }
      if (res.data.redeemed) {
        return Promise.reject(new TypedError(COUPON_REDEEMED));
      }
      if (res.data.expired) {
        return Promise.reject(new TypedError(COUPON_EXPIRED));
      }
      if (res.data.maximum_exceeded) {
        return Promise.reject(new TypedError(COUPON_EXCEEDED_MAX));
      }

      // Everything is fine
      return Promise.resolve();
    })
    .catch((err) => {
      if (err.status === 404) {
        return Promise.reject(new TypedError(COUPON_INVALID));
      }

      throw err;
    });
}

/**
 * Redeem a coupon and update user object
 * @param  {string} couponCode
 * @param  {string} userId
 * @return {Promise}
 */
export function redeemCoupon(couponCode, userId) {
  return axios({
    url: Settings.getLink('coupons', { user_id: userId }),
    method: 'post',
    data: JSON.stringify({ code: couponCode }),
  })
    .then((res) => {
      // @TODO make this work with the userId
      Auth.getUser().setBalance(res.data._embedded.user.balance);
      return res.data._embedded;
    })
    .catch((err) => {
      if (err.data.message.match(/Coupon (.+) not found./)) {
        throw new TypedError(COUPON_INVALID);
      }
      if (err.data.message === 'Unable to redeem subscription.') {
        throw new TypedError(COUPON_PRODUCT_ERROR);
      }
      if (err.data.message === 'Coupon already redeemed.') {
        throw new TypedError(COUPON_REDEEMED);
      }
      if (err.data.message === 'Campaign exceeded maximum.') {
        throw new TypedError(COUPON_EXCEEDED_MAX);
      }
      if (err.data.message === 'Coupon expired.') {
        throw new TypedError(COUPON_EXPIRED);
      }
      if (err.data.message === 'Coupon is only for new accounts.') {
        throw new TypedError(COUPON_NEW_USERS_ONLY);
      }
      if (err.data.message.match(/Campaign has already ended at .+\.$/)) {
        throw new TypedError(COUPON_CAMPAIGN_EXPIRED);
      }

      throw err;
    });
}



// WEBPACK FOOTER //
// ./src/js/app/managers/coupon.js