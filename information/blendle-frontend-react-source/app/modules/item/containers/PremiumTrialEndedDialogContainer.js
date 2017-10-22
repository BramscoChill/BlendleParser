import React, { PureComponent } from 'react';
import AltContainer from 'alt-container';
import UserActions from 'actions/UserActions';
import PremiumTrialEnded from '../components/PremiumTrialEnded';
import AuthStore from 'stores/AuthStore';
import { isActive, isTrial } from 'selectors/subscriptions';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import Analytics from 'instances/analytics';

class PremiumTrialEndedDialogContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      close: false,
    };
  }

  _onClose = (analyticsProps) => {
    const user = AuthStore.getState().user;

    Analytics.track('Upsell Dialog Dismissed', {
      ...analyticsProps,
    });

    UserActions.updateUserPref(user, 'did_dismiss_premium_trial_ended_dialog', true);

    this.setState({ close: true });
  };

  _onUpsell = (analyticsProps) => {
    Analytics.track('Subscription Upsell Started', {
      ...analyticsProps,
    });
  };

  _renderTrialEndedDialog = ({ authState, premiumSubscriptionsState }) => {
    const { user } = authState;
    const { subscription } = premiumSubscriptionsState;

    if (!user) {
      return null;
    }

    const userDidDismissDialog = user.getPreference('did_dismiss_premium_trial_ended_dialog');

    if (
      this.state.close ||
      !subscription ||
      userDidDismissDialog ||
      !isTrial(subscription) ||
      isActive(subscription)
    ) {
      return null;
    }

    return (
      <PremiumTrialEnded
        name={user.get('first_name')}
        onClose={this._onClose}
        onUpsell={this._onUpsell}
        subscriptionUid={subscription.uid}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{ authState: AuthStore, premiumSubscriptionsState: PremiumSubscriptionStore }}
        render={this._renderTrialEndedDialog}
      />
    );
  }
}

export default PremiumTrialEndedDialogContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/PremiumTrialEndedDialogContainer.js