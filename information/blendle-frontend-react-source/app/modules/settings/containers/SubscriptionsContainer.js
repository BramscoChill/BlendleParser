import React, { Component } from 'react';
import { flatten, get } from 'lodash';
import moment from 'moment';
import AltContainer from 'alt-container';
import Analytics from 'instances/analytics';
import { PREMIUM_PROVIDER_ID } from 'app-constants';
import SubscriptionsActions from 'actions/SubscriptionsActions';
import SubscriptionsStore from 'stores/SubscriptionsStore';
import AuthStore from 'stores/AuthStore';
import SubscriptionsList from '../components/SubscriptionsList';
import { groupSubscriptionsByProvider, isActive } from 'selectors/subscriptions';

const filterSubscriptions = (subscriptionsState) => {
  const subscriptionGroups = groupSubscriptionsByProvider(
    subscriptionsState.subscriptions,
  ).map((subscriptionGroup) => {
    const firstSubscription = subscriptionGroup[0];
    const providerUid =
      get(firstSubscription, 'provider.uid') || get(firstSubscription, 'product.provider_uid');

    if (providerUid === PREMIUM_PROVIDER_ID) {
      const activeSubscriptions = subscriptionGroup.filter(sub => isActive(sub));

      if (activeSubscriptions.length > 0) {
        // return all active Premium subscriptions
        return activeSubscriptions;
      }

      return subscriptionGroup.sort((subLeft, subRight) =>
        moment.utc(subRight.endDate).diff(moment.utc(subLeft.endDate)),
      )[0];
    }

    // For all other subscriptions, take the current active subscription
    return subscriptionGroup.find(sub => isActive(sub));
  });

  return flatten(subscriptionGroups).filter(sub => !!sub);
};

export default class SubscriptionsContainer extends Component {
  componentDidMount() {
    const authState = AuthStore.getState();
    SubscriptionsActions.fetchUserSubscriptions(authState.user.id, {
      active: false,
    });
  }

  _onCancel = (subscription) => {
    const user = AuthStore.getState().user;
    const reason = SubscriptionsStore.getState().cancelReason;

    SubscriptionsActions.stopSubscription(user.id, subscription.uid, reason);
    SubscriptionsActions.deselectSubscription();
  };

  _onLegacyCancel = (subscription) => {
    const authState = AuthStore.getState();
    SubscriptionsActions.cancelSubscription(authState.user.id, subscription.provider.uid);
  };

  _onClickUpsell = (subscription) => {
    Analytics.track('Subscription Upsell Started', {
      subscription_product_uid: subscription.uid,
      provider_id: subscription.provider.uid,
      internal_location: 'expired-subscription-card',
    });
  };

  _onUpdateReason(reason) {
    SubscriptionsActions.updateCancelReason(reason);
  }

  _onCloseDetails = () => {
    SubscriptionsActions.deselectSubscription();
  };

  _onClickMoreInfo = subscription => SubscriptionsActions.selectSubscription(subscription);

  _renderSubscriptionsList = subscriptionState => (
    <SubscriptionsList
      subscriptionsStatus={subscriptionState.status}
      subscriptions={filterSubscriptions(subscriptionState)}
      onClickMoreInfo={this._onClickMoreInfo}
      onLegacyCancel={this._onLegacyCancel}
      onCancel={this._onCancel}
      selectedSubscription={subscriptionState.selected}
      subscriptionDetails={subscriptionState.details}
      detailsStatus={subscriptionState.detailsStatus}
      onClickUpsell={this._onClickUpsell}
      onCloseDetails={this._onCloseDetails}
      onUpdateReason={this._onUpdateReason}
    />
  );

  render() {
    return <AltContainer store={SubscriptionsStore} render={this._renderSubscriptionsList} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/SubscriptionsContainer.js