import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'instances/i18n';
import history from 'libs/byebye/history';
import Link from 'components/Link';
import FacebookConnectContainer from 'components/facebookConnect/FacebookConnectContainer';
import Auth from 'controllers/auth';
import LoginContainer from 'components/login/LoginContainer';
import ResetPassword from '../ResetPassword';
import Analytics from 'instances/analytics';
import CSS from './style.scss';

export default class LoginDropdownContent extends React.Component {
  static propTypes = {
    active: PropTypes.oneOf(['login', 'resetPassword']),
    isOpen: PropTypes.bool,
    mobile: PropTypes.bool,
    onClose: PropTypes.func,
    onFacebookConnectDialogOpen: PropTypes.func,
  };

  static defaultProps = {
    active: 'login',
  };

  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      this.setState({
        active: nextProps.active,
      });
    }
  }

  setActivePanel(active) {
    this.setState({
      active,
    });
  }

  _onOpenFacebook() {
    Analytics.track('Connect Facebook Start', {
      location_in_layout: 'login-dropdown',
    });
  }

  _onFacebookError(error) {
    Analytics.track('Connect Facebook Error', {
      location_in_layout: 'login-dropdown',
      error: error.message,
    });
  }

  _onLogin() {
    // when the user tries to sign in with an unknown facebook account, it should be redirected to the signup module
    if (Auth.getUser().didOnboarding()) {
      Auth.navigateToReturnURL();
    } else {
      history.navigate('/signup/kiosk', { trigger: true });
    }
  }

  _setActivePanel(e, activePanel) {
    e.preventDefault();

    this.setState({
      active: activePanel,
    });
  }

  _renderPanelHeader(text, onClick) {
    return (
      <div className="v-panel-title">
        <Link className="btn-back" onClick={onClick} />
        {text}
      </div>
    );
  }

  _renderLoginSection() {
    const isLoginActive = this.state.active === 'login';
    const className = classNames(CSS.section, CSS.login, {
      [CSS.active]: isLoginActive,
    });

    const panelHeader = this.props.mobile
      ? this._renderPanelHeader(translate('app.text.login'), this.props.onClose)
      : null;

    return (
      <div className={className}>
        {panelHeader}
        <div className="v-login">
          <div className="form-container">
            <div className="v-dropdown-login">
              <div className="v-login-form">
                <h2>{translate('login.dropdown.fb.title')}</h2>
                <FacebookConnectContainer
                  analyticsName={'Login Dropdown'}
                  analyticsPayload={{ login_type: 'manual' }}
                  onLogin={() => this._onLogin()}
                  onSignUp={() => this._onLogin()}
                  onError={this._onFacebookError}
                  onClick={this._onOpenFacebook}
                  onConnectDialogueOpen={this.props.onFacebookConnectDialogOpen}
                />

                <h2>{translate('login.dropdown.blendle.title')}</h2>
                <LoginContainer
                  analyticsName={'Login Dropdown'}
                  analyticsPayload={{ login_type: 'manual' }}
                  isOpen={this.props.isOpen}
                  onLogin={() => this._onLogin()}
                  onToReset={e => this._setActivePanel(e, 'resetPassword')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderResetPasswordSection() {
    const isResetPasswordActive = this.state.active === 'resetPassword';
    const className = classNames(CSS.section, CSS.password, {
      [CSS.active]: isResetPasswordActive,
    });

    const header = this.props.mobile
      ? this._renderPanelHeader(translate('signup.signin.forgotPassword'), e =>
          this._setActivePanel(e, 'login'),
        )
      : null;

    return (
      <div className={className}>
        {header}
        <ResetPassword
          active={isResetPasswordActive}
          showBack
          onLoginLink={e => this._setActivePanel(e, 'login')}
        />
      </div>
    );
  }

  render() {
    const className = classNames('v-login-panel', CSS.container, {
      [CSS.isOpen]: this.props.isOpen,
    });
    return (
      <div className={className}>
        {this._renderLoginSection()}
        {this._renderResetPasswordSection()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/login/LoginDropdownContent/index.js