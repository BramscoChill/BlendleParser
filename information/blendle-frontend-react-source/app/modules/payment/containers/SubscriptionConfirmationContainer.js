import { STATUS_PENDING, STATUS_ERROR } from 'app-constants';
import altConnect from 'higher-order-components/altConnect';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';
import PaymentStore from 'stores/PaymentStore';
import SubscriptionsProductsStore from 'stores/SubscriptionsProductsStore';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import AuthStore from 'stores/AuthStore';
import SubscriptionConfirmation from 'modules/payment/components/SubscriptionConfirmation';

const onSubmitConfirmation = () => {
  const { directPaymentStatus, jwt } = SubscriptionOrderStore.getState();
  const { product } = SubscriptionsProductsStore.getState();
  const { user } = AuthStore.getState();
  const paymentState = PaymentStore.getState();
  const { selectedPaymentMethod } = paymentState;

  if (directPaymentStatus === STATUS_ERROR) {
    SubscriptionOrderActions.retry(paymentState, product, user);
  } else {
    SubscriptionOrderActions.directPayment(selectedPaymentMethod, product, jwt);
  }
};

const mapStateToProps = ({ paymentState, subscriptionsProductsState, subscriptionOrderState }) => {
  const { paymentMethods, selectedPaymentMethod, selectedBanks } = paymentState;
  const { product: subscription } = subscriptionsProductsState;
  const {
    paymentURL,
    directPaymentStatus,
    directPaymentError: paymentError,
  } = subscriptionOrderState;

  return {
    paymentURL,
    paymentError,
    subscription,
    paymentMethods,
    selectedPaymentMethod,
    selectedBank: selectedBanks[selectedPaymentMethod],
    paymentLoading: directPaymentStatus === STATUS_PENDING,
  };
};

mapStateToProps.stores = {
  PaymentStore,
  SubscriptionsProductsStore,
  SubscriptionOrderStore,
};

const actions = { onSubmitConfirmation };

export default altConnect(mapStateToProps, actions)(SubscriptionConfirmation);



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/containers/SubscriptionConfirmationContainer.js