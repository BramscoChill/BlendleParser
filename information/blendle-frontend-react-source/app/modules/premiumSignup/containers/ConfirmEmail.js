import React, { Component } from 'react';
import SignUpStore from 'stores/SignUpStore';
import AuthStore from 'stores/AuthStore';
import ConfirmAccountStore from 'stores/ConfirmAccountStore';
import ConfirmEmail from 'modules/premiumSignup/components/ConfirmEmail';
import AffiliatesStore from 'stores/AffiliatesStore';
import { getCustomCopy } from 'helpers/affiliates';
import AltContainer from 'alt-container';
import { STATUS_OK } from 'app-constants';

class ConfirmEmailContainer extends Component {
  _renderConfirmEmail({ authState, confirmAccountState, signUpState, affiliatesState }) {
    const { user } = authState;

    const customCopy = getCustomCopy('confirmEmail', affiliatesState.affiliate);

    return (
      <ConfirmEmail
        email={user.get('email')}
        firstName={user.get('first_name')}
        resend={confirmAccountState.resendStatus === STATUS_OK}
        isDeeplinkSignUp={signUpState.isDeeplinkSignUp}
        {...customCopy}
      />
    );
  }

  render() {
    return (
      <AltContainer
        stores={{
          authState: AuthStore,
          confirmAccountState: ConfirmAccountStore,
          signUpState: SignUpStore,
          affiliatesState: AffiliatesStore,
        }}
        render={this._renderConfirmEmail}
      />
    );
  }
}

export default ConfirmEmailContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/ConfirmEmail.js