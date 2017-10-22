/* eslint-disable class-methods-use-this */

import alt from 'instances/altInstance';
import {
  AUTH_REQUIRED,
  COUPON_INVALID,
  COUPON_REDEEMED,
  COUPON_EXPIRED,
  COUPON_EXCEEDED_MAX,
  COUPON_NEW_USERS_ONLY,
  COUPON_CAMPAIGN_EXPIRED,
  COUPON_PRODUCT_ERROR,
} from 'app-constants';
import Analytics from 'instances/analytics';
import TypedError from 'helpers/typederror';
import { redeemCoupon, validateCoupon } from 'managers/coupon';

class CouponActions {
  redeem(code, userId) {
    return (dispatch) => {
      dispatch({ code });

      validateCoupon(code)
        .then(() => {
          // Redeeming coupons requires auth
          if (!userId) {
            this.redeemError({ error: new TypedError(AUTH_REQUIRED), code });
            return;
          }

          redeemCoupon(code, userId)
            .then((data) => {
              this.redeemSuccess({ data, code });
            })
            .catch((error) => {
              const errors = [
                COUPON_INVALID,
                COUPON_REDEEMED,
                COUPON_EXCEEDED_MAX,
                COUPON_EXPIRED,
                COUPON_NEW_USERS_ONLY,
                COUPON_CAMPAIGN_EXPIRED,
                COUPON_PRODUCT_ERROR,
              ];

              this.redeemError({ error, code });

              if (!errors.includes(error.type)) {
                throw error;
              }
            });
        })
        .catch((error) => {
          this.redeemError({ error, code });
        });
    };
  }

  redeemSuccess({ data, code }) {
    Analytics.track('Redeem Coupon: Success', {
      type: 'coupon-deeplink',
      coupon: code || '', // always emit at least an empty string
    });

    return { data };
  }

  redeemError({ error, code }) {
    Analytics.track('Redeem Coupon: Failed', {
      type: 'coupon-deeplink',
      reason: error.type,
      coupon: code || '', // always emit at least an empty string
    });

    return { error };
  }
}

export default alt.createActions(CouponActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/CouponActions.js