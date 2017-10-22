import moment from 'moment';
import { PREMIUM_BUNDLE_TYPES } from 'app-constants';
import { getDateString } from 'helpers/dateString';
import { isTrial, isRenew } from 'selectors/subscriptions';
import { capitalize } from 'lodash';
import { translate } from 'instances/i18n';

const bundleLabelLookup = {
  [PREMIUM_BUNDLE_TYPES.DAILY]: (recommendationSlot) => {
    const bundleMoment = moment(recommendationSlot);
    const dateString = getDateString(bundleMoment, {
      todayOrYesterday: false,
    });
    return capitalize(dateString);
  },
  [PREMIUM_BUNDLE_TYPES.REST]: () => translate('timeline.bundle.earlier_this_week'),
  [PREMIUM_BUNDLE_TYPES.WEEKLY]: () => translate('timeline.bundle.weekly'),
  [PREMIUM_BUNDLE_TYPES.MAGAZINE]: () => translate('timeline.bundle.magazine'),
  [PREMIUM_BUNDLE_TYPES.MUST_READ]: () => translate('timeline.bundle.must_read'),
  [PREMIUM_BUNDLE_TYPES.FOR_YOU]: () => translate('timeline.bundle.for_you'),
  [PREMIUM_BUNDLE_TYPES.MANUAL]: () => translate('timeline.bundle.extra'),
};

export function getBundleLabel(bundleType, recommendationSlot) {
  const bundleTypeLookup = bundleLabelLookup[bundleType];
  if (!bundleTypeLookup) {
    // A bundle type with no label is being rendered. Notify sentry
    window.Raven.captureMessage(`Bundle type "${bundleType}" does not have a label`);
    return capitalize(bundleType);
  }

  return bundleTypeLookup(recommendationSlot);
}

export function isFirstBundleInTrial(recommendationSlot, premiumSubscription) {
  if (!premiumSubscription) {
    return false;
  }

  const recommendationMoment = moment(recommendationSlot).startOf('day');
  const difference = premiumSubscription.startDate
    .startOf('day')
    .diff(recommendationMoment, 'days');

  return (
    isTrial(premiumSubscription) &&
    (difference === 0 || difference === -1) && // Bundle after midnight
    !isRenew(premiumSubscription) // When renew is true don't show the first time intro
  );
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/bundle.js