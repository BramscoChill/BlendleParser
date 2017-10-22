import React from 'react';
import PropTypes from 'prop-types';
import Settings from 'controllers/settings';
import { translate, translateElement } from 'instances/i18n';
import LogoLink from 'components/navigation/LogoLink';
import BrowserEnvironment from 'instances/browser_environment';
import LoginDropdownContainer from 'containers/navigation/LoginDropdownContainer';

export default class DeeplinkHeader extends React.Component {
  static propTypes = {
    variant: PropTypes.oneOf(['login', 'signUp']),
    onToSignUp: PropTypes.func.isRequired,
  };

  openLoginDropdown() {
    if (this.refs.loginDropdown) {
      this.refs.loginDropdown.openLoginDropdown();
    }
  }

  openReset() {
    if (this.refs.loginDropdown) {
      this.refs.loginDropdown.openLoginDropdown('resetPassword');
    }
  }

  _renderLogo() {
    const { width, height } = BrowserEnvironment.isMobile()
      ? { width: 70, height: 19 }
      : { width: 84, height: 22 };

    return <LogoLink height={height} width={width} />;
  }

  _renderSignUpHeader() {
    return (
      <div className="v-primary-navigation">
        {this._renderLogo()}
        <div className="deeplink-login">
          <LoginDropdownContainer className="deeplink-login-dropdown" ref="loginDropdown" />
        </div>
      </div>
    );
  }

  _renderLoginHeader() {
    return (
      <div className="v-primary-navigation">
        {this._renderLogo()}
        <div className="deeplink-login">
          <p>{translateElement('deeplink.header.no_account')} </p>
          <a className="btn btn-green btn-signup" href="#" onClick={this.props.onToSignUp}>
            {translateElement('deeplink.header.signup')}
          </a>
        </div>
      </div>
    );
  }

  render() {
    let headerFn = this._renderSignUpHeader;
    if (this.props.variant === 'login') {
      headerFn = this._renderLoginHeader;
    }
    return <div className="v-deeplink-header">{headerFn.call(this)}</div>;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/components/DeeplinkHeader.js