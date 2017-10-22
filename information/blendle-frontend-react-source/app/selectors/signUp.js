import { get } from 'lodash';
import {
  SIGNUP_TYPE_COUPON,
  SIGNUP_TYPE_AFFILIATE,
  SIGNUP_TYPE_PAID_ADVERTISEMENT,
  SIGNUP_TYPE_DEEPLINK,
  SIGNUP_TYPE_SUBSCRIPTION,
  SIGNUP_TYPE_PREMIUM_ONBOARDING,
  SIGNUP_TYPE_ONBOARDING,
  SIGNUP_TYPE_EMAIL_DEEPLINK,
} from 'app-constants';

export const getCouponCode = signUpState => get(signUpState, 'context.coupon_code');

export const isPremiumSignUp = signUpData => signUpData.signup_type === 'premium';

export const signUpPayload = (signupType) => {
  const internalLocation = {
    [SIGNUP_TYPE_COUPON]: 'coupon',
    [SIGNUP_TYPE_AFFILIATE]: 'affiliate-page',
    [SIGNUP_TYPE_DEEPLINK]: 'deeplink',
    [SIGNUP_TYPE_SUBSCRIPTION]: 'subscription',
    [SIGNUP_TYPE_PREMIUM_ONBOARDING]: 'premiumonboarding',
    [SIGNUP_TYPE_EMAIL_DEEPLINK]: 'email-deeplink',
    [SIGNUP_TYPE_ONBOARDING]: 'onboarding',
    [SIGNUP_TYPE_PAID_ADVERTISEMENT]: 'paid-advertisement',
  };

  return {
    internal_location: internalLocation[signupType],
  };
};



// WEBPACK FOOTER //
// ./src/js/app/selectors/signUp.js