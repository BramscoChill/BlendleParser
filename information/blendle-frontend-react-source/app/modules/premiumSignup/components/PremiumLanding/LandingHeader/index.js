import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';
import { track } from 'helpers/premiumOnboardingEvents';
import { setLocationInLayout } from 'helpers/locationInLayout';
import googleAnalytics from 'instances/google_analytics';
import Analytics from 'instances/analytics';
import Link from 'components/Link';
import Browser from '../LandingBrowser';
import LandingCSS from '../style.scss';
import CSS from './style.scss';

class LandingHeader extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    ctaUrl: PropTypes.string,
  };

  _onClickCTA(buttonText) {
    return () => {
      setLocationInLayout('header');
      track(Analytics, 'Open Dialogue');
      googleAnalytics.trackEvent(window.location.pathname, 'button', buttonText);
    };
  }

  render() {
    const { className } = this.props;
    const buttonText = 'Probeer een week gratis';
    const disclaimer = shouldGetAutoRenewTrial() ? (
      <p className={CSS.disclaimer}>Je kunt op elk moment opzeggen</p>
    ) : (
      <p className={CSS.disclaimer}>
        <strong>Stopt vanzelf,</strong> dus je zit nergens aan vast.
      </p>
    );

    return (
      <section className={classNames(className, CSS.header)}>
        <div className={LandingCSS.sectionInner}>
          <div>
            <h1 className={classNames(CSS.sectionTitle, LandingCSS.slideUp)}>
              Het beste uit 120 kranten en
              <br /> tijdschriften op één plek
            </h1>
            <span className={classNames(CSS.sub, LandingCSS.slideUp)}>
              Elke dag de verhalen die bij jou passen.
              <br /> Zonder nepnieuws. Zonder filterbubbel.
            </span>
            <div className={classNames(CSS.cta, LandingCSS.slideUp)}>
              <Link
                className={classNames('btn', LandingCSS.cta)}
                href={this.props.ctaUrl}
                data-test-identifier="landing-cta"
                onClick={this._onClickCTA(buttonText)}
              >
                {buttonText}
              </Link>
              {disclaimer}
            </div>
          </div>
        </div>
        <Browser />
      </section>
    );
  }
}

export default LandingHeader;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumLanding/LandingHeader/index.js