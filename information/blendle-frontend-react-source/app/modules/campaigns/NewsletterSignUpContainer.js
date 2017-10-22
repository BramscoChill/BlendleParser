import React from 'react';
import SignUpManager from 'managers/signup';
import { history } from 'byebye';
import BlendleSignUpModel from 'models/blendlesignup';
import Analytics from 'instances/analytics';
import i18n from 'instances/i18n';
import {
  EMAIL_BLACKLISTED,
  USER_ID_TAKEN,
  EMAIL_EXISTS,
  SIGNUP_TYPE_EMAIL_DEEPLINK,
} from 'app-constants';
import NewsletterSignUp from './NewsletterSignUp';
import SuccessDialogue from './NewsletterSignUpSuccessDialogue';

const analyticsEvent = 'Newsletter Landing';

export default class NewsletterSignUpContainer extends React.Component {
  state = {
    userVerified: false,
  };

  componentWillMount() {
    Analytics.track(`Open ${analyticsEvent}`);
  }

  _onShowLogin() {
    return history.navigate('/login', { trigger: true });
  }

  _onSignUp(email) {
    return new Promise((resolve, reject) => {
      SignUpManager.emailIsAllowed(email)
        .then(() => SignUpManager.emailIsAvailable(email))
        .then(() => {
          const signUpUser = new BlendleSignUpModel({
            email,
            country: i18n.getCountryCode(),
            primary_language: i18n.currentLocale,
            referrer: 'email-landing-page',
          });

          if (i18n.getLocale() === 'en_US') {
            signUpUser.set('signup_code', 'DL8sh37s');
          }

          SignUpManager.signup(signUpUser, SIGNUP_TYPE_EMAIL_DEEPLINK).then(resolve, reject);
        })
        .catch((err) => {
          if ([EMAIL_BLACKLISTED, USER_ID_TAKEN, EMAIL_EXISTS].includes(err.type)) {
            return reject(err);
          }

          throw err;
        });
    });
  }

  _onCloseVerified() {
    return history.navigate('/email/verify', { trigger: true });
  }

  _onFacebookConnect(facebookStatus) {
    return history.navigate('/email/verify', { trigger: true, replace: true });
  }

  render() {
    if (this.state.userVerified) {
      return <SuccessDialogue onClose={this._onCloseVerified.bind(this)} />;
    }

    return (
      <NewsletterSignUp
        analyticsEvent={analyticsEvent}
        onSignUp={this._onSignUp.bind(this)}
        onShowLogin={this._onShowLogin.bind(this)}
        onFacebookConnect={this._onFacebookConnect.bind(this)}
        showUSVersion={i18n.getLocale() === 'en_US'}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/campaigns/NewsletterSignUpContainer.js