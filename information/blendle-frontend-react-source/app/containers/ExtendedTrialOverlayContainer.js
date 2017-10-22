import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import AltContainer from 'alt-container';
import googleAnalytics from 'instances/google_analytics';
import { STATUS_OK, STATUS_ERROR, HOME_ROUTE, PREMIUM_EXTENDED_TRIAL_PRODUCT } from 'app-constants';
import AuthStore from 'stores/AuthStore';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import SubscriptionProductsStore from 'stores/SubscriptionsProductsStore';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import LoadingOverlay from 'components/LoadingOverlay';
import ExtendedTrialErrorDialog from '../components/ExtendedTrialErrorDialog';

class ExtendedTrialOverlayContainer extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    // Because the backend will allow starting an extended trial even if the user isn't eligible
    // We have to manually check the eligibility status of the extended premium trial product
    SubscriptionProductsActions.fetchProduct.defer(PREMIUM_EXTENDED_TRIAL_PRODUCT);
    SubscriptionProductsStore.listen(this._onSubscriptionProductsStoreChanged);
  }

  _onSubscriptionProductsStoreChanged = (storeState) => {
    if (this._didAttemptTrial) {
      return;
    }

    const user = AuthStore.getState().user;

    // Only start the trial if the user is eligible for the product
    if (storeState.status === STATUS_OK && storeState.product.eligible) {
      SubscriptionOrderActions.startTrial.defer(
        {
          onSuccess: () => {
            googleAnalytics.trackEvent(window.location.pathname, 'extend trial', 'success');
            this.props.router.push(`${HOME_ROUTE}/success`);
          },
          paymentType: 'confirmed_email_address',
          subscriptionProductId: PREMIUM_EXTENDED_TRIAL_PRODUCT,
        },
        user.id,
      );

      this._didAttemptTrial = true;
    }
  };

  _onClose = () => {
    this.props.router.push(HOME_ROUTE);
  };

  _renderOverlay = ({ subscriptionOrderState, subscriptionProductsState, authState }) => {
    const { trialStatus } = subscriptionOrderState;
    const { product, status: productStatus } = subscriptionProductsState;
    const { user } = authState;

    const isError =
      (productStatus === STATUS_OK && !product.eligible) || trialStatus === STATUS_ERROR;

    if (isError) {
      return <ExtendedTrialErrorDialog onClose={this._onClose} userEmail={user.get('email')} />;
    }

    return <LoadingOverlay />;
  };

  render() {
    return (
      <AltContainer
        stores={{
          subscriptionOrderState: SubscriptionOrderStore,
          subscriptionProductsState: SubscriptionProductsStore,
          authState: AuthStore,
        }}
        render={this._renderOverlay}
      />
    );
  }
}

export default withRouter(ExtendedTrialOverlayContainer);



// WEBPACK FOOTER //
// ./src/js/app/containers/ExtendedTrialOverlayContainer.js