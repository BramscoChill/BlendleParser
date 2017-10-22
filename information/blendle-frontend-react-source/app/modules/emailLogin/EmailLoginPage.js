import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { history } from 'byebye';
import withRouter from 'react-router/lib/withRouter';
import { STATUS_OK, STATUS_ERROR, SIGNUP_PLATFORM_FACEBOOK, REDIRECT_TO_URL } from 'app-constants';
import { translate } from 'instances/i18n';
import Analytics from 'instances/analytics';
import googleAnalytics from 'instances/google_analytics';
import { shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';
import LoginActions from 'actions/LoginActions';
import ApplicationActions from 'actions/ApplicationActions';
import SignUpActions from 'actions/SignUpActions';
import Logo from 'components/Logo';
import Link from 'components/Link';
import FacebookConnect from 'components/facebookConnect/FacebookConnect';

const trackGA = (instance, pathname, action, label, value) => {
  if (shouldTrackGAClickEvent(pathname)) {
    instance.trackEvent(pathname, action, label, value);
  }
};

class EmailLoginPage extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    loginState: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  state = {
    password: '',
    isResend: false,
  };

  componentDidUpdate(prevProps) {
    const { loginState } = this.props;
    const loginStatus = loginState.login.status;

    if (loginStatus === STATUS_OK) {
      this._onLogin();
    }

    if (loginStatus === STATUS_ERROR && prevProps.loginState.login.status !== STATUS_ERROR) {
      Analytics.track('Login Failed');
    }
  }

  _onLogin = () => {
    setTimeout(() => {
      const { router, data } = this.props;

      router.push(`/item/${data.item_id}`);
    });
  };

  _onSubmit = (ev) => {
    ev.preventDefault();

    LoginActions.loginWithCredentials(
      {
        login: this.props.data.user_id,
        password: this.state.password,
      },
      { login_type: 'manual' },
    );
  };

  _onResend = (ev) => {
    ev.preventDefault();

    Analytics.track('Email login/resend');

    LoginActions.sendLoginEmail(this.props.data.user_id, this.props.data.item_id, null, true);

    this.setState({
      isResend: true,
    });
  };

  _onPasswordChange = (ev) => {
    this.setState({
      password: ev.target.value,
    });
  };

  _onNotMe() {
    // eslint-disable-line class-methods-use-this
    Analytics.track('Email login/not me');
  }

  _onFacebookSignup = () => {
    const redirectUrl = `/item/${this.props.data.item_id}?verified=true`;

    ApplicationActions.set(REDIRECT_TO_URL, redirectUrl);
    SignUpActions.setSignupPlatform(SIGNUP_PLATFORM_FACEBOOK);

    history.navigate(
      history.fragment,
      { trigger: true, replace: true },
      { returnUrl: '/signup/deeplink' },
    );

    trackGA(googleAnalytics, window.location.pathname, 'button', 'facebook signup');
  };

  _renderResendLink() {
    const { loginState } = this.props;
    const status = loginState.loginEmail.status;

    if (status === STATUS_OK && this.state.isResend) {
      return <span>{translate('app.email_login.resend_success')}</span>;
    }

    if (status === STATUS_ERROR) {
      return (
        <Link href="#" onClick={this._onResend}>
          {translate('app.email_login.resend_error')}
        </Link>
      );
    }

    return (
      <Link href="#" onClick={this._onResend}>
        {translate('app.email_login.resend')}
      </Link>
    );
  }

  _renderLoginForm() {
    const btnClassName = classNames({
      btn: true,
      hidden: !this.state.password,
    });

    let errorMessage;

    if (this.props.loginState.login.status === STATUS_ERROR) {
      errorMessage = (
        <div className="error-message visible">
          {translate('app.email_login.incorrect_password')}
        </div>
      );
    }

    return (
      <div className="login-form">
        <div className="body">
          <h2>{translate('app.email_login.password_message')}</h2>
          <form name="login" className="frm" onSubmit={this._onSubmit}>
            <div className="frm-field-wrapper">
              <input
                name="password"
                onChange={this._onPasswordChange}
                className="inp inp-text"
                type="password"
                placeholder={translate('app.user.password')}
              />
              {errorMessage}
            </div>
            <input
              className={btnClassName}
              type="submit"
              value={translate('app.email_login.login')}
            />
          </form>
          <div className="v-facebook-connect">
            {translate('deeplink.signup.or')}
            <FacebookConnect
              className="inline"
              onLogin={this._onLogin}
              onSignUp={this._onFacebookSignup}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { data } = this.props;
    const { item_id: itemId, domain } = data;
    const name = data.name ? ` ${data.name}` : '';
    const notMeText = data.name
      ? translate('app.email_login.wrong_user', [data.name])
      : translate('app.email_login.wrong_user_noname');

    return (
      <div className="v-email-login-page">
        <header className="header">
          <Link href="/">
            <Logo />
          </Link>
        </header>

        <div className="login-mail">
          <div className="body">
            <h1>{translate('app.email_login.header', [name, domain])}</h1>
            <p>{translate('app.email_login.intro')}</p>
            <ul>
              <li>{this._renderResendLink()}</li>
              <li>
                <Link href={`/item/${itemId}`} onClick={this._onNotMe}>
                  {notMeText}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {this._renderLoginForm()}
      </div>
    );
  }
}

export default withRouter(EmailLoginPage);



// WEBPACK FOOTER //
// ./src/js/app/modules/emailLogin/EmailLoginPage.js