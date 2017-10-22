import { history } from 'byebye';
import { STATUS_OK, STATUS_PENDING, USER_ID_TAKEN } from 'app-constants';
import React from 'react';
import PropTypes from 'prop-types';
import SignUpStore from 'stores/SignUpStore';
import AuthStore from 'stores/AuthStore';
import SignUpActions from 'actions/SignUpActions';
import SignUpForm from './SignUpForm';
import LoginContainer from 'components/login/LoginContainer';

export default class SignUpContainer extends React.Component {
  static propTypes = {
    analyticsPayload: PropTypes.object,
    onSignUp: PropTypes.func, // deprecated, use the SignUpStore or AuthStore

    // when clicking a 'login' link, like in an 'email exists' error message.
    // default leads to /login
    onToLogin: PropTypes.func,

    // provide extra data to send to the signup and confirmation webservice
    // this could contain keys like `referrer` or `entry_item`
    signUpContext: PropTypes.object,
    buttonHTML: PropTypes.string,
    verifyEmail: PropTypes.bool,

    onLogin: PropTypes.func,
    onToReset: PropTypes.func,

    showPasswordField: PropTypes.bool,
    signUpType: PropTypes.string,
  };

  static defaultProps = {
    verifyEmail: false,
    analyticsName: 'Signup Form',
    analyticsPayload: {},
    signUpContext: {},
    showPasswordField: false,
    onToLogin() {
      history.navigate('/login', { trigger: true });
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      signUpStore: SignUpStore.getState(),
      authStore: AuthStore.getState(),
    };

    SignUpStore.listen(this._onSignUpStore);
    AuthStore.listen(this._onAuthStore);
  }

  componentWillUnmount() {
    SignUpStore.unlisten(this._onSignUpStore);
    AuthStore.unlisten(this._onAuthStore);
  }

  _onSignUpStore = (storeState) => {
    if (storeState.status === STATUS_OK) {
      setTimeout(this.props.onSignUp);
    } else {
      this.setState({ signUpStore: storeState });
    }
  };

  _onAuthStore = (storeState) => {
    this.setState({ authStore: storeState });
  };

  _onSignUp = (email, options) => {
    const context = {
      ...this.props.signUpContext,
      ...options,
    };

    SignUpActions.signUp(email, context, {
      verifyEmail: this.props.verifyEmail,
      analyticsPayload: this.props.analyticsPayload,
      signUpType: this.props.signUpType,
    });
  };

  render() {
    if (this.state.signUpStore.error === USER_ID_TAKEN) {
      return (
        <LoginContainer
          email={this.state.signUpStore.email}
          onLogin={this.props.onLogin}
          onToReset={this.props.onToReset}
          analyticsPayload={this.props.analyticsPayload}
        />
      );
    }

    return (
      <SignUpForm
        buttonHTML={this.props.buttonHTML}
        onToLogin={this.props.onToLogin}
        error={this.state.signUpStore.error}
        onSignUp={this._onSignUp}
        isLoading={this.state.signUpStore.status === STATUS_PENDING}
        showPasswordField={this.props.showPasswordField}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/signUp/SignUpContainer.js