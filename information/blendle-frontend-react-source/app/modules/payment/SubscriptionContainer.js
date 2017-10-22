import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { debounce } from 'lodash';
import SubscriptionsProductsStore from 'stores/SubscriptionsProductsStore';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import AuthStore from 'stores/AuthStore';
import { STATUS_PENDING } from 'app-constants';
import SubscriptionDialogue from 'modules/payment/components/SubscriptionDialogue';

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

  renderPayment = ({ subscriptionProductsState, subscriptionOrderState }) => {
    if (!subscriptionProductsState.product) {
      return null;
    }

    return (
      <SubscriptionDialogue
        activeStep={subscriptionOrderState.activeStep}
        onBack={() => SubscriptionOrderActions.setActiveStep('options')}
        onClose={this.props.onClose}
        loading={
          subscriptionOrderState.status === STATUS_PENDING ||
          subscriptionProductsState.status === STATUS_PENDING
        }
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          subscriptionProductsState: SubscriptionsProductsStore,
          subscriptionOrderState: SubscriptionOrderStore,
        }}
        render={this.renderPayment}
      />
    );
  }
}

export default SubscriptionContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/SubscriptionContainer.js