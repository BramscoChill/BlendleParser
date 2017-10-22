import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { debounce } from 'lodash';
import PaymentStore from 'stores/PaymentStore';
import SubscriptionsProductsStore from 'stores/SubscriptionsProductsStore';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import AuthStore from 'stores/AuthStore';
import { STATUS_OK, STATUS_ERROR } from 'app-constants';
import PremiumSubscriptionDialogue from 'modules/payment/components/PremiumSubscriptionDialogue';

const loadedStates = [STATUS_OK, STATUS_ERROR];
const debouncedStartSubscriptionOrder = debounce(
  SubscriptionOrderActions.startSubscriptionOrder,
  200,
);

class SubscriptionContainer extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    subscriptionProductId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    // Fetch is debounced because it triggered fast rerenders and fired
    // multiple 'order started' events
    debouncedStartSubscriptionOrder(AuthStore.getState().user, this.props.subscriptionProductId);
  }

  _onSubscriptionContainerClose = () => {
    this.props.onClose();

    SubscriptionOrderActions.setActiveStep('options');
  };

  _renderPayment = ({
    paymentState,
    subscriptionProductsState,
    subscriptionOrderState,
    authState,
  }) => {
    const { user } = authState;
    const userFirstName = user.getFirstName() ? ` ${user.getFirstName()}` : '';

    if (!subscriptionProductsState.product) {
      return null;
    }

    return (
      <PremiumSubscriptionDialogue
        activeStep={subscriptionOrderState.activeStep}
        onBack={() => SubscriptionOrderActions.setActiveStep('options')}
        onClose={this._onSubscriptionContainerClose}
        subscription={subscriptionProductsState.product}
        firstName={userFirstName}
        loading={
          !subscriptionProductsState.product ||
          !loadedStates.includes(subscriptionOrderState.status) ||
          !loadedStates.includes(subscriptionProductsState.status) ||
          !loadedStates.includes(paymentState.status)
        }
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          paymentState: PaymentStore,
          subscriptionProductsState: SubscriptionsProductsStore,
          subscriptionOrderState: SubscriptionOrderStore,
          authState: AuthStore,
        }}
        render={this._renderPayment}
      />
    );
  }
}

export default SubscriptionContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/PremiumSubscriptionContainer.js