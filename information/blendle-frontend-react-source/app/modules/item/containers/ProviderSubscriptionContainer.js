import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import AltContainer from 'alt-container';
import { STATUS_PENDING } from 'app-constants';
import SubscriptionsActions from 'actions/SubscriptionsActions';
import SubscriptionsStore from 'stores/SubscriptionsStore';
import AuthStore from 'stores/AuthStore';
import SubscriptionProductsStore from 'stores/SubscriptionsProductsStore';
import ProviderStore from 'stores/ProviderStore';
import TilesStore from 'stores/TilesStore';
import Analytics from 'instances/analytics';
import { filterSubscription } from 'selectors/subscriptions';
import { providerById } from 'selectors/providers';
import { activeSubscriptions as getActiveSubscriptions } from 'selectors/user';
import ProviderSubscription from '../components/ProviderSubscription';

function getEventName(buttonName, isVisible) {
  return `${buttonName} Button ${isVisible ? 'In' : 'Out Of'} Viewport`;
}

const isLoading = ({ subscriptionsState, subscriptionProductsState }, providerId) =>
  !subscriptionProductsState.providerProducts[providerId] ||
  [
    subscriptionsState.status,
    subscriptionProductsState.providerProducts[providerId].status,
  ].includes(STATUS_PENDING);

const fetchData = (itemId) => {
  const { tiles } = TilesStore.getState();
  const tile = tiles.get(itemId);
  const { user } = AuthStore.getState();

  SubscriptionProductsActions.fetchProviderProducts.defer(tile._embedded['b:manifest'].provider.id);
  SubscriptionsActions.fetchUserSubscriptions.defer(user.id);
};

class ProviderSubscriptionContainer extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    fetchData(this.props.itemId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.itemId !== nextProps.itemId) {
      fetchData(this.props.itemId);
    }
  }

  _onChangeSubscriptionVisibility = (isVisible, subscriptionUid) => {
    const { tiles } = TilesStore.getState();
    const tile = tiles.get(this.props.itemId);
    const providerId = tile._embedded['b:manifest'].provider.id;

    Analytics.track(getEventName('Subscription', isVisible), {
      item_id: this.props.itemId,
      provider_id: providerId,
      subscription_product_uid: subscriptionUid,
    });
  };

  // eslint-disable-next-line react/prop-types
  _renderProviderSubscription = ({
    subscriptionProductsState,
    subscriptionsState,
    authState,
    tilesState,
    providerState,
  }) => {
    const { tiles } = tilesState;
    const tile = tiles.get(this.props.itemId);

    const providerId = tile._embedded['b:manifest'].provider.id;
    const provider = providerById(providerState, providerId);
    const activeSubscriptions = getActiveSubscriptions(authState.user);

    // Return null when stores are loading or when the user has a subscription for the provider
    if (
      isLoading({ subscriptionProductsState, subscriptionsState }, providerId) ||
      activeSubscriptions.includes(providerId)
    ) {
      return null;
    }

    const providerSubscriptions = subscriptionProductsState.providerProducts[providerId];
    const userSubscriptions = subscriptionProductsState.subscriptions;
    const subscription = filterSubscription(providerSubscriptions, userSubscriptions);

    if (!subscription) {
      return null;
    }

    return (
      <ProviderSubscription
        onChangeVisibility={this._onChangeSubscriptionVisibility}
        subscriptionUid={subscription.uid}
        providerName={provider.name}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          subscriptionProductsState: SubscriptionProductsStore,
          subscriptionsState: SubscriptionsStore,
          authState: AuthStore,
          tilesState: TilesStore,
          providerState: ProviderStore,
        }}
        render={this._renderProviderSubscription}
      />
    );
  }
}

export default ProviderSubscriptionContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ProviderSubscriptionContainer.js