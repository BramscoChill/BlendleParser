import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getLandingCtaUrl } from 'helpers/onboarding';
import LandingHeader from './LandingHeader';
import LandingAbout from './LandingAbout';
import LandingPricing from './LandingPricing';
import LandingTweets from './LandingTweets';
import LandingFaq from './LandingFaq';
import LandingFooter from './LandingFooter';
import faqEntries from './faqEntries';
import withDialogs from '../../higher-order-components/withDialogs';
import CSS from './style.scss';

class PremiumLandingPage extends PureComponent {
  static propTypes = {
    product: PropTypes.object,
    affiliate: PropTypes.object,
    user: PropTypes.object,
    topBanner: PropTypes.node,
    dialog: PropTypes.node,
  };

  _renderTopBanner = () => {
    const { user, product, affiliate, topBanner } = this.props;
    // Render the default header if we don't have one passed in
    if (!topBanner) {
      return (
        <LandingHeader
          className={CSS.sectionFullscreen}
          ctaUrl={getLandingCtaUrl({ user, product })}
          isAffiliate={!!affiliate}
        />
      );
    }

    return this.props.topBanner;
  };

  _renderDialog() {
    return this.props.dialog || null;
  }

  render() {
    const { user, product, affiliate } = this.props;
    const ctaUrl = getLandingCtaUrl({ user, product });

    return (
      <div className={CSS.landingPage} data-test-identifier="premium-landing">
        <div className={CSS.content}>
          {this._renderTopBanner()}
          <LandingAbout ctaUrl={ctaUrl} affiliate={affiliate} />
          <LandingPricing ctaUrl={ctaUrl} affiliate={affiliate} />
          <LandingTweets className={CSS.sectionFullscreen} />
          <LandingFaq
            className={CSS.sectionFullscreen}
            entries={faqEntries}
            ctaUrl={ctaUrl}
            affiliate={affiliate}
          />
        </div>
        <div className={CSS.footer}>
          <LandingFooter shouldHideAppButtons={!!affiliate} />
        </div>
        {this._renderDialog()}
      </div>
    );
  }
}

export default withDialogs(PremiumLandingPage);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumLanding/index.js