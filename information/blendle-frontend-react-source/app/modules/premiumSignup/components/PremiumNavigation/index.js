import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import i18n from 'instances/i18n';
import { translate } from 'instances/i18n';
import { getExceptionForCountry } from 'helpers/countryExceptions';
import { getLandingCtaUrl } from 'helpers/onboarding';
import { setLocationInLayout } from 'helpers/locationInLayout';
import Scroll from 'helpers/scroll';
import LogoLink from 'components/navigation/LogoLink';
import Link from 'components/Link';
import {
  Button,
  NavigationBar,
  NavigationLeft,
  NavigationRight,
  NavigationItem,
} from '@blendle/lego';
import UserDropdownContainer from 'containers/navigation/UserDropdownContainer';
import CSS from './styles.scss';

class PremiumNavigation extends PureComponent {
  static propTypes = {
    mobile: PropTypes.bool.isRequired,
    authorizedUser: PropTypes.object,
    loginUrl: PropTypes.string.isRequired,
    aboutUrl: PropTypes.string.isRequired,
    faqUrl: PropTypes.string.isRequired,
    hasAccessToPremiumFeatures: PropTypes.bool,
    premiumTrialProduct: PropTypes.object,
    shouldHideTryNow: PropTypes.bool,
    lightLoginButton: PropTypes.bool,
    hideLinks: PropTypes.bool,
  };

  _renderNavigation() {
    if (this.props.authorizedUser) {
      return <UserDropdownContainer />;
    }

    const color = this.props.lightLoginButton ? 'cash-green-outline' : 'cash-green';

    return (
      <div className={CSS.loginWrapper}>
        <Link href={this.props.loginUrl}>
          <Button className={CSS.loginButton} color={color}>
            {translate('app.buttons.login')}
          </Button>
        </Link>
      </div>
    );
  }

  _onClick = (e) => {
    const sectionId = e.currentTarget.href.split('#')[1];

    if (sectionId === null) {
      return;
    }

    Scroll.verticalToId(sectionId);
  };

  _onClickTryNow() {
    setLocationInLayout('navigationbar');
  }

  _renderTryNow() {
    const { shouldHideTryNow, authorizedUser, premiumTrialProduct } = this.props;

    if (shouldHideTryNow) {
      return null;
    }

    const tryNowUrl = getLandingCtaUrl({ user: authorizedUser, product: premiumTrialProduct });

    return (
      <NavigationItem>
        <Link className={CSS.link} href={tryNowUrl} onClick={this._onClickTryNow}>
          Nu proberen
        </Link>
      </NavigationItem>
    );
  }

  _renderLinks() {
    const { aboutUrl, faqUrl, hideLinks } = this.props;
    if (hideLinks) {
      return null;
    }

    return (
      <div className={`v-primary-navigation-items ${CSS.links}`}>
        <NavigationItem>
          <Link className={CSS.link} href={aboutUrl} onClick={this._onClick}>
            Wat is Blendle?
          </Link>
        </NavigationItem>
        <NavigationItem>
          <Link className={CSS.link} href={faqUrl} onClick={this._onClick}>
            Veelgestelde vragen
          </Link>
        </NavigationItem>
        {this._renderTryNow()}
      </div>
    );
  }

  render() {
    const { mobile } = this.props;
    const sideMargin = mobile ? 14 : 20;
    const style = { marginLeft: sideMargin, marginRight: sideMargin };

    return (
      <NavigationBar>
        <NavigationLeft>
          <LogoLink
            beta={getExceptionForCountry(i18n.getCountryCode(), 'showBetaLogo', false)}
            width={97}
            height={26}
            style={style}
          />
        </NavigationLeft>
        <NavigationRight>
          {this._renderLinks()}
          {this._renderNavigation()}
        </NavigationRight>
      </NavigationBar>
    );
  }
}

export default PremiumNavigation;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/PremiumNavigation/index.js