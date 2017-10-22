import alt from 'instances/altInstance';
import {
  STATUS_INITIAL,
  STATUS_PENDING,
  STATUS_OK,
  STATUS_ERROR,
  PREMIUM_ALL_SUBSCRIPTION_PRODUCTS,
} from 'app-constants';
import SubscriptionActions from 'actions/SubscriptionsActions';
import PremiumSubscriptionActions from 'actions/PremiumSubscriptionActions';

class PremiumSubscriptionStore {
  constructor() {
    this.bindActions(PremiumSubscriptionActions);
    this.bindActions(SubscriptionActions);

    this.state = {
      status: STATUS_INITIAL,
      subscription: null,
      error: null,
    };
  }

  onFetchLatestPremiumSubscription() {
    this.setState({
      status: this.state === STATUS_OK ? STATUS_OK : STATUS_PENDING, // Don't set loading state when refreshing.
      error: null,
    });
  }

  onFetchLatestPremiumSubscriptionSuccess(subscription) {
    this.setState({
      status: STATUS_OK,
      subscription,
    });
  }

  onFetchLatestPremiumSubscriptionError(error) {
    this.setState({
      status: STATUS_ERROR,
      error,
    });
  }

  onFetchUserSubscriptionSuccess(subscription) {
    if (PREMIUM_ALL_SUBSCRIPTION_PRODUCTS.includes(subscription.uid)) {
      this.setState({
        subscription,
        status: STATUS_OK,
        error: null,
      });
    }
  }
}

export default alt.createStore(PremiumSubscriptionStore, 'PremiumSubscriptionStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/PremiumSubscriptionStore.js