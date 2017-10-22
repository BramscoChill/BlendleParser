import { translate } from 'instances/i18n';
import {
  COUPON_REDEEMED,
  COUPON_EXPIRED,
  COUPON_EXCEEDED_MAX,
  COUPON_NEW_USERS_ONLY,
  COUPON_CAMPAIGN_EXPIRED,
  COUPON_PRODUCT_ERROR,
} from 'app-constants';

export const couponErrorMessage = (errorType) => {
  const errorMessages = {
    [COUPON_NEW_USERS_ONLY]: translate('settings.coupons.redeem.error_new_users_only'),
    [COUPON_REDEEMED]: translate('settings.coupons.redeem.error_already_redeemed'),
    [COUPON_EXCEEDED_MAX]: translate('settings.coupons.redeem.error_exceeded_maximum'),
    [COUPON_EXPIRED]: translate('settings.coupons.redeem.error_expired'),
    [COUPON_CAMPAIGN_EXPIRED]: translate('settings.coupons.redeem.error_expired'),
    [COUPON_PRODUCT_ERROR]: translate('settings.coupons.redeem.error_product_error'),
    default: translate('settings.coupons.redeem.error_invalid'),
  };

  return errorMessages[errorType] || errorMessages.default;
};



// WEBPACK FOOTER //
// ./src/js/app/selectors/coupon.js