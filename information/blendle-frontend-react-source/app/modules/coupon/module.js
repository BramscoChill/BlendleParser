import React from 'react';
import CouponContainer from './CouponContainer';
import GiftContainer from 'modules/coupon/GiftContainer';
import Analytics from 'instances/analytics';

export function openRedeem(code) {
  Analytics.track('Redeem Coupon: Deeplink', {
    hasCode: !!code,
  });

  return <CouponContainer initialCode={code} />;
}

export function openGift() {
  return <GiftContainer />;
}



// WEBPACK FOOTER //
// ./src/js/app/modules/coupon/module.js