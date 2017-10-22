import React, { Component } from 'react';
import AuthStore from 'stores/AuthStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import { getCustomCopy } from 'helpers/affiliates';
import ConfirmEmail from 'modules/premiumSignup/components/ConfirmEmail';
import AltContainer from 'alt-container';

class RedeemContainer extends Component {
  _renderConfirmEmail = ({ authState, affiliatesState, subscriptionOrderState }) => {
    const user = authState.user;
    const { affiliate } = affiliatesState;
    const customCopy = getCustomCopy('redeem', affiliate);

    return (
      <ConfirmEmail
        email={user.get('email')}
        firstName={user.get('first_name')}
        affiliateSuccessUrl={subscriptionOrderState.redirect_url}
        {...customCopy}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          authState: AuthStore,
          affiliatesState: AffiliatesStore,
          subscriptionOrderState: SubscriptionOrderStore,
        }}
        render={this._renderConfirmEmail}
      />
    );
  }
}

export default RedeemContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/Redeem.js