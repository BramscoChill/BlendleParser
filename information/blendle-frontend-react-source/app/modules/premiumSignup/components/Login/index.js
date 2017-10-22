import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EmailInput, PasswordInput, Button, Form } from '@blendle/lego';
import {
  PASSWORD_INVALID,
  STATUS_PENDING,
  STATUS_ERROR,
  INVALID_TOKEN,
  MISSING_PASSWORD,
} from 'app-constants';
import { translate, translateElement } from 'instances/i18n';
import Analytics from 'instances/analytics';
import googleAnalytics from 'instances/google_analytics';
import {
  emailErrorMessages,
  passwordErrorMessages,
  getErrorMessage,
} from 'helpers/inputErrorMessages';
import { replaceLastPath } from 'helpers/url';
import { track, shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';
import FacebookConnectContainer from 'components/facebookConnect/FacebookConnectContainer';
import EmailLoginLink from 'components/login/EmailLoginLink';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Link from 'components/Link';

import CSS from '../Signup/SignUp.scss'; // Form is almost identical, so reuse its CSS

const trackGA = (instance, pathname, action, label, value) => {
  if (shouldTrackGAClickEvent(pathname)) {
    instance.trackEvent(pathname, action, label, value);
  }
};

class Login extends Component {
  static propTypes = {
    onFacebookLogin: PropTypes.func.isRequired,
    onFacebookSignUp: PropTypes.func.isRequired,
    onSendLoginEmail: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loginState: PropTypes.object,
    emailLoginState: PropTypes.object,
    error: PropTypes.string,
    clearError: PropTypes.func,
    dialogTitle: PropTypes.string,
    buttonText: PropTypes.string,
    tagline: PropTypes.string,
    disabled: PropTypes.bool,
    userFormValue: PropTypes.object,
    onUserFormInput: PropTypes.func,
    facebookSignUpType: PropTypes.string,
    facebookSignUpContext: PropTypes.object.isRequired,
  };

  static defaultProps = {
    dialogTitle: 'Even inloggen en je kunt gaan lezen!',
    buttonText: 'Inloggen',
    onUserFormInput: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      email: this.props.loginState.email || '',
      showError: {
        email: false,
        password: false,
      },
      invalidInputs: [],
      eventMap: {
        email: 'Login/Email',
        password: 'Login/Password',
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { error, userFormValue } = nextProps;
    if (error) {
      this.setState({
        showError: {
          email: Object.keys(emailErrorMessages).includes(error),
          password: Object.keys(passwordErrorMessages).includes(error),
        },
      });
    }

    if (userFormValue) {
      this.setState(userFormValue);
    }
  }

  _findEmtpyInputs = () => {
    const emptyInputs = [];

    if (this.state.password === '') {
      emptyInputs.push('password');
    }
    if (this.state.email === '') {
      emptyInputs.push('email');
    }

    return emptyInputs;
  };

  _onKeyUp = (event) => {
    const { name: inputName, value } = event.currentTarget;

    this.props.onUserFormInput({
      [inputName]: value,
    });
    if (value && this.state.eventMap[inputName]) {
      // 1Password makes silly async things
      // the value isn't filled in directly
      // so wrap 'em in a timeout
      setTimeout(() => {
        track(Analytics, this.state.eventMap[inputName]);
        const eventMap = { ...this.state.eventMap, [inputName]: null };
        this.setState({ eventMap });
      });
    }
  };

  _onChange = (e) => {
    const inputName = e.target.getAttribute('name');

    this.setState({
      [inputName]: e.target.value,
      invalidInputs: [],
      showError: {
        ...this.state.showError,
        [inputName]: false,
      },
    });
  };

  _onSubmit = () => {
    const emptyInputs = this._findEmtpyInputs();

    if (emptyInputs.length > 0) {
      return this.setState({
        showError: {
          email: emptyInputs.includes('email'),
          password: emptyInputs.includes('password'),
        },
        invalidInputs: emptyInputs,
      });
    }

    trackGA(googleAnalytics, window.location.pathname, 'button', 'login');

    return this.props.onSubmit(this.state);
  };

  _onSendLoginEmail = () => {
    this.props.onSendLoginEmail(this.state.email.trim());
  };

  _onFacebookLogin = () => {
    this.props.onFacebookLogin();
    trackGA(googleAnalytics, window.location.pathname, 'button', 'facebook login');
  };

  _onFacebookSignUp = () => {
    this.props.onFacebookSignUp();
    trackGA(googleAnalytics, window.location.pathname, 'button', 'facebook signup');
  };

  _onFacebookError(error) {
    track(Analytics, 'Connect Facebook Error', {
      location_in_layout: 'login_dialog',
      error: error.message,
    });
  }

  _onOpenFacebook() {
    track(Analytics, 'Connect Facebook Start', {
      location_in_layout: 'login_dialog',
    });
  }

  _getEmailErrorMessage = () => {
    if (!this.state.showError.email || !this.props.error) {
      return null;
    }

    return (
      <Link href={replaceLastPath(window.location.pathname, 'login')} className={CSS.emailError}>
        {getErrorMessage(this.props.error, emailErrorMessages)}
      </Link>
    );
  };

  _getPasswordErrorMessage = () => {
    if (!this.state.showError.password || !this.props.error) {
      return null;
    }

    if (this.props.error === PASSWORD_INVALID && this.state.password.length < 5) {
      return translate('error.password_too_short');
    }

    return getErrorMessage(this.props.error, passwordErrorMessages);
  };

  _renderEmailLoginLink = () => {
    const { loginState, emailLoginState } = this.props;
    let component = null;

    if (
      !this.state.hideEmailLogin &&
      loginState.status === STATUS_ERROR &&
      (loginState.error.type === INVALID_TOKEN || loginState.error.type === MISSING_PASSWORD)
    ) {
      component = (
        <EmailLoginLink
          key="link"
          emailLoginState={emailLoginState}
          onSendLoginEmail={this._onSendLoginEmail}
          email={this.state.email}
        />
      );
    }

    return (
      <ReactCSSTransitionGroup
        key="link"
        component="div"
        transitionName="slide"
        transitionEnter
        transitionEnterTimeout={500}
        transitionLeave={false}
        children={component}
      />
    );
  };

  _renderTagline(tagline) {
    return tagline ? <p>{tagline}</p> : null;
  }

  render() {
    const { showError, invalidInputs } = this.state;
    const { loginState, facebookSignUpContext } = this.props;
    const emailError = !!(invalidInputs.includes('email') || showError.email);
    const passwordError = !!(invalidInputs.includes('password') || showError.password);
    const footerClasses = classnames(CSS.footer, CSS.clearGlobalMargin);

    return (
      <div data-test-identifier="login-form">
        <h2>{this.props.dialogTitle}</h2>
        {this._renderTagline(this.props.tagline)}
        <div>
          <FacebookConnectContainer
            buttonText={translate('deeplink.signup.facebook')}
            analyticsPayload={{ login_type: 'manual' }}
            onClick={this._onOpenFacebook}
            onLogin={this._onFacebookLogin}
            onSignUp={this._onFacebookSignUp}
            onError={this._onFacebookError}
            signUpType={this.props.facebookSignUpType}
            signUpContext={facebookSignUpContext}
          />
          <span className={CSS.divider}>{translate('app.text.or')}</span>
          <Form
            name="premium-login"
            onSubmit={this._onSubmit}
            className={CSS.signupForm}
            disabled={this.props.disabled}
            noValidate
          >
            <EmailInput
              name="email"
              value={this.state.email}
              placeholder="Wat is je e-mailadres?"
              className={CSS.clearGlobalMargin}
              onChange={this._onChange}
              onKeyUp={this._onKeyUp}
              error={emailError}
              message={this._getEmailErrorMessage()}
              autoFocus
            />
            {this._renderEmailLoginLink()}
            <PasswordInput
              name="password"
              value={this.state.password}
              className={CSS.clearGlobalMargin}
              placeholder="Wat is je wachtwoord?"
              onChange={this._onChange}
              onKeyUp={this._onKeyUp}
              error={passwordError}
              message={this._getPasswordErrorMessage()}
            />
            <Button
              type="submit"
              color="cash-green"
              className="btn-fullwidth"
              isLoading={loginState.status === STATUS_PENDING}
            >
              Inloggen
            </Button>
            <Link
              className={CSS.forgotPassword}
              href={replaceLastPath(window.location.pathname, 'reset')}
            >
              {translate('login.dropdown.to_reset_token')}
            </Link>
          </Form>
        </div>
        <p className={footerClasses}>
          <Link href="/about/termsandconditions">{translate('terms_and_conditions')}</Link>
          {'. '}
          {translateElement('deeplink.footer.cookies')}
        </p>
      </div>
    );
  }
}

export default Login;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/components/Login/index.js