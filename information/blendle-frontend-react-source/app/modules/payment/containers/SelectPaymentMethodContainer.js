import { compose, lifecycle } from 'recompose';
import { PREMIUM_ONE_WEEK_AUTO_RENEWAL } from 'app-constants';
import altConnect from 'higher-order-components/altConnect';
import PaymentActions from 'actions/PaymentActions';
import AuthStore from 'stores/AuthStore';
import PaymentStore from 'stores/PaymentStore';
import SubscriptionsProductsStore from 'stores/SubscriptionsProductsStore';
import SelectPaymentMethod from '../components/SelectPaymentMethod';

const onSelect = (paymentCode) => {
  const { selectedBanks, paymentMethods } = PaymentStore.getState();

  PaymentActions.setPaymentMethod(paymentCode, selectedBanks[paymentCode], paymentMethods);
};

const mapStateToProps = ({ authState: { user }, paymentState, subscriptionsProductsState }) => {
  const { product = {} } = subscriptionsProductsState;
  const {
    recurring_contracts: recurringContracts,
    paymentMethods,
    selectedPaymentMethod,
    status,
  } = paymentState;

  const filteredPaymentMethods =
    product.uid === PREMIUM_ONE_WEEK_AUTO_RENEWAL
      ? paymentMethods.filter(method => method.code !== 'paypal')
      : paymentMethods;

  return {
    user,
    recurringContracts,
    status,
    selectedPaymentMethod,
    paymentMethods: filteredPaymentMethods,
  };
};

mapStateToProps.stores = { AuthStore, PaymentStore, SubscriptionsProductsStore };

const actions = { onSelect };

const enhance = compose(
  altConnect(mapStateToProps, actions),
  lifecycle({
    componentDidMount() {
      const { paymentMethods, user } = this.props;
      if (!paymentMethods.length) {
        PaymentActions.fetchPaymentMethods.defer(user);
      }
    },
  }),
);

export default enhance(SelectPaymentMethod);



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/containers/SelectPaymentMethodContainer.js