import React, { PureComponent } from 'react';
import AuthStore from 'stores/AuthStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import { isActive } from 'selectors/subscriptions';
import AuthActions from 'actions/AuthActions';
import PayPerArticleWarningDialog from 'components/dialogues/PayPerArticleWarningDialog';
import AltContainer from 'alt-container';

const DID_DISMISS_USER_PREF = 'did_dismiss_non_premium_timeline_dialog';

class PayPerArticleWarningDialogContainer extends PureComponent {
  _onDialogClosed = () => {
    const user = AuthStore.getState().user;
    user.savePreferences({ [DID_DISMISS_USER_PREF]: true }).then(() => AuthActions.update(user));
  };

  _renderDialog = ({ authState, premiumState }) => {
    const user = authState.user;
    const premiumSubscription = premiumState.subscription;
    if (!user) {
      return null;
    }

    const userDismissedDialog = user.getPreference(DID_DISMISS_USER_PREF);
    if (userDismissedDialog || (!premiumSubscription || !isActive(premiumSubscription))) {
      return null;
    }

    const showGift = user.get('balance') === '2.50'; // TODO: https://trello.com/c/BIY007M2/988-distinguish-existing-users-that-used-ppa-from-users-that-have-only-used-premium
    return <PayPerArticleWarningDialog onClose={this._onDialogClosed} showGift={showGift} />;
  };

  render() {
    return (
      <AltContainer
        stores={{ authState: AuthStore, premiumState: PremiumSubscriptionStore }}
        render={this._renderDialog}
      />
    );
  }
}

export default PayPerArticleWarningDialogContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/dialogues/PayPerArticleWarningDialogContainer.js