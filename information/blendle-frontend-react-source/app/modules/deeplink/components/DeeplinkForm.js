import React from 'react';
import PropTypes from 'prop-types';
import { translate, translateElement } from 'instances/i18n';
import FacebookConnectContainer from 'components/facebookConnect/FacebookConnectContainer';
import SignUpContainer from 'components/signUp/SignUpContainer';
import SignUpVerificationContainer from 'components/signUp/SignUpVerificationContainer';
import LoginContainer from 'components/login/LoginContainer';
import InternationalLaunchHelper from 'helpers/internationalLaunch';
import getUrlSiteName from 'helpers/getUrlSiteName';
import { getException } from 'helpers/countryExceptions';
import { SIGNUP_TYPE_DEEPLINK } from 'app-constants';
import Analytics from 'instances/analytics';

const analyticsName = 'Deeplink Form';

export default class DeeplinkForm extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    variant: PropTypes.oneOf(['login', 'signUp']),
    onToLogin: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    onToReset: PropTypes.func.isRequired,
    onFacebookSignUp: PropTypes.func.isRequired,
    onEmailSignUp: PropTypes.func.isRequired,
  };

  state = {
    didEmailSignUp: false,
  };

  _onFacebookError(error) {
    Analytics.track('Connect Facebook Error', {
      internal_location: 'deeplink',
      error: error.message,
    });
  }

  _onOpenFacebook() {
    Analytics.track('Connect Facebook Start', {
      internal_location: 'deeplink',
    });
  }

  _onEmailSignUp() {
    this.props.onEmailSignUp();
    this.setState({ didEmailSignUp: true });
  }

  _onToLaunchPage(ev) {
    ev.preventDefault();
    InternationalLaunchHelper.redirectToLaunchSite();
  }

  _onClickLogin(e) {
    e.preventDefault();

    // There's an <a /> tag in the OneSky phrase, which is the link that should be clickable
    if (e.target.tagName === 'A') {
      this.props.onToLogin('');
    }
  }

  _getSignUpContext() {
    const itemId = this.props.item.id;
    return { entry_item: itemId, deeplink_item: itemId };
  }

  _getIntroText() {
    if (getException('hideDeeplinkIntro', false)) {
      return null;
    }

    const referrerName = getUrlSiteName(document.referrer);
    if (referrerName) {
      return translateElement(<h2 />, 'deeplink.clean.text_referrer', [referrerName], false);
    }
    return translateElement(<h2 />, 'deeplink.clean.text', false);
  }

  _renderLogin() {
    return (
      <div className="form-container">
        <div className="v-deeplink-login">
          <div className="v-login-form">
            <h2>{translateElement('login.dropdown.fb.title')}</h2>
            <FacebookConnectContainer
              buttonText={translate('deeplink.signup.facebook')}
              analyticsPayload={{ login_type: 'manual' }}
              signUpType={SIGNUP_TYPE_DEEPLINK}
              onClick={this._onOpenFacebook}
              onLogin={this.props.onLogin}
              onSignUp={this.props.onFacebookSignUp}
              onError={this._onFacebookError}
            />

            <h2>{translateElement('login.dropdown.blendle.title')}</h2>
            <LoginContainer
              analyticsName={analyticsName}
              buttonHTML={translate('deeplink.login.continue')}
              analyticsPayload={{ login_type: 'manual' }}
              onLogin={this.props.onLogin}
              signUpContext={this._getSignUpContext()}
              onToReset={this.props.onToReset}
            />
          </div>
        </div>
      </div>
    );
  }

  _renderSignUp() {
    let fbConnect;
    if (!this.state.didEmailSignUp) {
      fbConnect = (
        <div className="deeplink-fb-connect">
          <span className="facebook-or">{translateElement('app.text.or')}</span>
          <FacebookConnectContainer
            buttonText={translate('deeplink.signup.facebook')}
            signUpType={SIGNUP_TYPE_DEEPLINK}
            signUpContext={this._getSignUpContext()}
            analyticsPayload={{ login_type: 'manual' }}
            onClick={this._onOpenFacebook}
            onLogin={this.props.onLogin}
            onSignUp={this.props.onFacebookSignUp}
            onError={this._onFacebookError}
          />
        </div>
      );
    }

    let signUp;
    let loginLink;
    let intro;
    if (!this.state.didEmailSignUp) {
      signUp = (
        <SignUpContainer
          signUpType={SIGNUP_TYPE_DEEPLINK}
          analyticsPayload={{
            item_id: this.props.item.id,
            login_type: 'manual',
          }}
          buttonHTML={translate('deeplink.signup.read')}
          verifyEmail
          onToLogin={this.props.onToLogin}
          onSignUp={this._onEmailSignUp.bind(this)}
          signUpContext={this._getSignUpContext()}
          onLogin={this.props.onLogin}
          onToReset={this.props.onToReset}
        />
      );

      intro = this._getIntroText();

      loginLink = translateElement(
        <p className="has-account" onClick={this._onClickLogin.bind(this)} />,
        'deeplink.signup.login',
        false,
      );
    } else {
      signUp = (
        <SignUpVerificationContainer
          analyticsName={analyticsName}
          signUpContext={this._getSignUpContext()}
        />
      );
    }

    return (
      <div className="form-container">
        <div className="v-form v-deeplink-signup m-signup">
          {intro}
          {signUp}
          {fbConnect}
          {loginLink}
        </div>
      </div>
    );
  }

  render() {
    if (this.props.variant === 'login') {
      return this._renderLogin();
    }
    return this._renderSignUp();
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/components/DeeplinkForm.js