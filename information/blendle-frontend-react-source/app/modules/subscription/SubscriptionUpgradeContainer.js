import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import SubscriptionActions from 'actions/SubscriptionsActions';
import SubscriptionProductsStore from 'stores/SubscriptionsProductsStore';
import SubscriptionsStore from 'stores/SubscriptionsStore';
import IssuesStore from 'stores/IssuesStore';
import Auth from 'controllers/auth';
import SubscriptionPage from 'modules/subscription/components/SubscriptionPage';
import { STATUS_ERROR } from 'app-constants';
import Error from 'components/GeneralError';
import i18n from 'instances/i18n';
import { providerById, prefillSelector } from 'selectors/providers';
import { getRemainingDays } from 'selectors/subscriptions';

class SubscriptionUpgradeContainer extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  componentWillMount() {
    if (this.props.params.fromId) {
      SubscriptionActions.fetchUserSubscription(this.props.params.fromId, Auth.getId());
    }

    SubscriptionProductsActions.fetchProduct(this.props.params.toId).catch(() => {});
  }

  _renderPage = (stores) => {
    let fromSubscription;
    const fromId = this.props.params.fromId;
    if (fromId) {
      fromSubscription = stores.SubscriptionsStore.subscriptions.find(s => s.uid === fromId);
    }
    const toSubscription = stores.SubscriptionProductsStore.product;

    if ((fromId && fromSubscription && toSubscription) || (!fromId && toSubscription)) {
      const providerId = toSubscription.provider_uid;
      const providerName = prefillSelector(providerById)(providerId).name;
      const daysRemaining = fromSubscription ? getRemainingDays(fromSubscription) : null;

      return (
        <SubscriptionPage
          providerId={providerId}
          providerName={providerName}
          fromSubscription={fromSubscription}
          toSubscription={toSubscription}
          daysRemaining={daysRemaining}
          userCurrency={i18n.currentCurrency}
        />
      );
    }

    if (
      stores.SubscriptionsStore.status === STATUS_ERROR ||
      stores.SubscriptionProductsStore.status === STATUS_ERROR
    ) {
      return <Error />;
    }

    return <div className="subscription-page-loading" />;
  };

  render() {
    return (
      <AltContainer
        stores={{ SubscriptionsStore, SubscriptionProductsStore, IssuesStore }}
        render={this._renderPage}
      />
    );
  }
}

export default SubscriptionUpgradeContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/subscription/SubscriptionUpgradeContainer.js