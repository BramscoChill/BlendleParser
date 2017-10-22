import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { memoize } from 'lodash';
import { Backdrop } from '@blendle/lego';
import { getTrialUpsellTitle, getTrialUpsellBody } from 'helpers/upsell';
import { PREMIUM_TRIAL_PRODUCT, PREMIUM_MONTHLY_PRODUCT, PREMIUM_PROVIDER_ID } from 'app-constants';
import ReaderBanner from '../ReaderBanner';

const LIMIT = 4;

const getTags = (remainingDays) => {
  const tags = [
    `${PREMIUM_TRIAL_PRODUCT}-active`,
    `${PREMIUM_TRIAL_PRODUCT}-${remainingDays}-days-left`,
    `${PREMIUM_MONTHLY_PRODUCT}-offered`,
  ];

  if (remainingDays <= LIMIT) {
    tags.push(`${PREMIUM_TRIAL_PRODUCT}-expiring`);
  }

  return tags;
};

// Helper function to skip rerendering in pure components
const getAnalytics = memoize(
  (remainingDays, analytics) => ({
    ...analytics,
    tags: getTags(remainingDays),
    subscription_product_uid: PREMIUM_MONTHLY_PRODUCT,
    provider_id: PREMIUM_PROVIDER_ID,
  }),
  (remainingDays, analytics) => `getAnalytics::${JSON.stringify(analytics)}::${remainingDays}`,
);

class PremiumRunningTrialBanner extends PureComponent {
  static propTypes = {
    remainingDays: PropTypes.number.isRequired,
    onClickCta: PropTypes.func.isRequired,
    analytics: ReaderBanner.propTypes.analytics,
  };

  static defaultProps = {
    analytics: {},
  };

  render() {
    const { remainingDays, onClickCta, analytics } = this.props;
    return (
      <ReaderBanner
        titleText={getTrialUpsellTitle(remainingDays)}
        bodyText={getTrialUpsellBody(remainingDays)}
        ctaText="Toegang houden"
        onClickCta={onClickCta}
        ctaColor="white"
        backdropColor={Backdrop.red()}
        backdropInnerColor={Backdrop.yellow()}
        analytics={getAnalytics(remainingDays, analytics)}
      />
    );
  }
}

export default PremiumRunningTrialBanner;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/PremiumRunningTrialBanner/index.js