import { STATUS_PENDING, STATUS_OK, STATUS_ERROR, STATUS_INITIAL } from 'app-constants';
import alt from 'instances/altInstance';
import SubscriptionActions from 'actions/SubscriptionsActions';

class SubscriptionsStore {
  constructor() {
    this.bindActions(SubscriptionActions);
    this.state = {
      subscriptions: [],
      status: STATUS_INITIAL,
      error: null,
      selected: null,
      cancelReason: null,
    };
  }

  onFetchUserSubscriptionSuccess(subscription) {
    const currentSubscriptions = this.state.subscriptions.filter(s => s.uid !== subscription.uid);

    this.setState({
      status: STATUS_OK,
      subscriptions: [...currentSubscriptions, subscription],
    });
  }

  onFetchUserSubscriptionError({ error, subscription }) {
    let subscriptions = this.state.subscriptions;
    if (subscription) {
      subscriptions = subscriptions.filter(s => s.uid !== subscription.uid);
      subscriptions.push(subscription);
    }

    this.setState({
      status: STATUS_ERROR,
      error,
      subscriptions,
    });
  }

  onFetchUserSubscription() {
    this.setState({ status: STATUS_PENDING });
  }

  onPollFetchUserSubscription() {
    this.setState({ status: STATUS_PENDING });
  }

  onFetchUserSubscriptions() {
    this.setState({ status: STATUS_PENDING });
  }

  onFetchUserSubscriptionsSuccess(subscriptions) {
    this.setState({
      status: STATUS_OK,
      subscriptions,
    });
  }

  onFetchUserSubscriptionsError({ error }) {
    this.setState({
      status: STATUS_ERROR,
      error,
    });
  }

  onUpdateCancelReason(cancelReason) {
    this.setState({ cancelReason });
  }

  onSelectSubscription({ subscription }) {
    this.setState({
      selected: subscription,
      cancelReason: null,
    });
  }

  onDeselectSubscription() {
    this.setState({
      selected: null,
      cancelReason: null,
    });
  }
}

export default alt.createStore(SubscriptionsStore, 'SubscriptionsStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/SubscriptionsStore.js