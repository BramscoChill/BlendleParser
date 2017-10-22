import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Logo from 'components/Logo';
import Link from 'components/Link';
import googleAnalytics from 'instances/google_analytics';
import FacebookLogo from 'components/icons/Facebook';
import TwitterLogo from 'components/icons/Twitter';
import AppStoreButton from 'components/buttons/AppStoreButton';
import PlayStoreButton from 'components/buttons/PlayStoreButton';
import CSS from './style.scss';
export default class LandingFooter extends PureComponent {
  static propTypes = {
    shouldHideAppButtons: PropTypes.bool,
  };

  _onClickAppStore() {
    googleAnalytics.trackEvent(window.location.pathname, 'button', 'footer_appstore');
  }

  _onClickPlayStore() {
    googleAnalytics.trackEvent(window.location.pathname, 'button', 'footer_googleplay');
  }

  _renderAppButtons() {
    if (this.props.shouldHideAppButtons) {
      return null;
    }

    return (
      <div className={CSS.appStoreLinks}>
        <AppStoreButton className={CSS.appStoreLink} onClick={this._onClickAppStore} />
        <PlayStoreButton onClick={this._onClickPlayStore} />
      </div>
    );
  }

  render() {
    return (
      <div className={CSS.footer}>
        <Logo />
        {this._renderAppButtons()}
        <div className={CSS.social}>
          <Link href="https://facebook.com/blendle">
            <FacebookLogo className={`${CSS.socialIcon} ${CSS.facebook}`} />
          </Link>
          <Link href="https://twitter.com/blendleNL">
            <TwitterLogo className={`${CSS.socialIcon} ${CSS.twitter}`} />
          </Link>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumLanding/LandingFooter/index.js