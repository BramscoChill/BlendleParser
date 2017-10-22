import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import LoginForm from './LoginForm';
import LoginActions from 'actions/LoginActions';
import AuthStore from 'stores/AuthStore';
import LoginStore from 'stores/LoginStore';
import { STATUS_OK } from 'app-constants';

export default class LoginContainer extends React.Component {
  static propTypes = {
    analyticsPayload: PropTypes.object,
    onToReset: PropTypes.func,
    onLogin: PropTypes.func, // deprecated, use the LoginStore or AuthStore
    buttonHTML: PropTypes.string,
    email: PropTypes.string,
    isOpen: PropTypes.bool,
  };

  static defaultProps = {
    analyticsPayload: {},
  };

  constructor() {
    super();
    LoginStore.listen(this._onLoginStore.bind(this));
  }

  _onLoginStore(loginStore) {
    if (loginStore.login.status === STATUS_OK) {
      setTimeout(() => {
        if (this.props.onLogin) {
          this.props.onLogin(AuthStore.getState().user);
        }
      });
    }
  }

  _onLogin(login, password) {
    LoginActions.loginWithCredentials({ login, password }, this.props.analyticsPayload);
  }

  _onSendLoginEmail(login) {
    LoginActions.sendLoginEmail(login, null, window.location.pathname, null, {
      location_in_layout: 'login-dropdown',
    });
  }

  _renderLoginForm(loginStore) {
    return (
      <LoginForm
        initialUsername={this.props.email || loginStore.login.email}
        loginState={loginStore.login}
        emailLoginState={loginStore.loginEmail}
        isOpen={this.props.isOpen}
        buttonHTML={this.props.buttonHTML}
        onToReset={this.props.onToReset}
        onLogin={this._onLogin.bind(this)}
        onSendLoginEmail={this._onSendLoginEmail.bind(this)}
      />
    );
  }

  render() {
    return <AltContainer store={LoginStore} render={this._renderLoginForm.bind(this)} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/login/LoginContainer.js