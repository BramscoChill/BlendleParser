import React from 'react';
import Auth from 'controllers/auth';
import { history } from 'byebye';
import { couponCampaigns as campaigns } from 'config/campaigns';
import { getLocale } from 'instances/i18n';
import NewsletterSignUpContainer from 'modules/campaigns/NewsletterSignUpContainer';
import CouponContainer from 'modules/coupon/CouponContainer';

export function openCoupon(campaignId, code) {
  const campaign = campaigns.find(c => c.id === campaignId);

  // Make sure we don't use UTM data as initial code
  if (code && typeof code === 'string') {
    campaign.code = code;
  }

  // The Germans get a special coupon
  if (campaign.id === 'paypal' && getLocale() === 'de_DE') {
    campaign.code = 'PAYPALDE2015';
  }

  return <CouponContainer initialCode={campaign.code} campaign={campaign} />;
}

export function openNewsletterSignUp() {
  // Redirect to settings when logged in
  if (Auth.getUser()) {
    window.location = '/settings/emails';
    return <span />;
  }

  return <NewsletterSignUpContainer />;
}

export function openGreetzCampaign() {
  if (Auth.getUser()) {
    return openCoupon('greetz_logged_in');
  }

  return openCoupon('greetz');
}

export function openVncCampaign() {
  if (Auth.getUser()) {
    return openCoupon('vnc_logged_in');
  }

  return openCoupon('vnc');
}

export function openHtmCampaign() {
  if (Auth.getUser()) {
    return openCoupon('htm_logged_in');
  }

  return openCoupon('htm');
}

export function openAholdCampaign(code) {
  const existingUserVersions = {
    LKJ60HZD52: 'LKJ60HZD51',
  };
  const initialCode = Auth.getUser() ? existingUserVersions[code] : code;

  return <CouponContainer initialCode={initialCode} existingUserVersions={existingUserVersions} />;
}

export function openVodafoneCampaign(campaignId, code) {
  const campaign = campaigns.find(c => c.id === campaignId);

  // We want to use different codes for existing users. The CouponContainer will use this object
  // to map coupon codes
  const existingUserVersions = {
    V45TRs3P11: 'V45TRs3P22',
    V45TRs3P33: 'V45TRs3P44',
    V45TRs3P55: 'V45TRs3P66',
    V45TRs3P77: 'V45TRs3P88',
  };

  const initialCode = Auth.getUser() ? existingUserVersions[code] : code;

  return (
    <CouponContainer
      initialCode={initialCode}
      existingUserVersions={existingUserVersions}
      campaign={campaign}
    />
  );
}



// WEBPACK FOOTER //
// ./src/js/app/modules/campaigns/module.js