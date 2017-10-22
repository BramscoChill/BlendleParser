import PropTypes from 'prop-types';
import { compose, setPropTypes, lifecycle } from 'recompose';
import { STATUS_PENDING } from 'app-constants';
import { translate } from 'instances/i18n';
import altConnect from 'higher-order-components/altConnect';
import { PREMIUM_ONE_MONTH_PROMO } from 'app-constants';
import SubscriptionOptions from 'modules/payment/components/SubscriptionOptions';
import SubscriptionActions from 'actions/SubscriptionsActions';
import PaymentStore from 'stores/PaymentStore';
import {
  getSubscription,
  isActiveContinuousSubscription,
  isExpired,
} from 'selectors/subscriptions';
import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';
import SubscriptionsProductsStore from 'stores/SubscriptionsProductsStore';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import SubscriptionsStore from 'stores/SubscriptionsStore';
import AuthStore from 'stores/AuthStore';
import PaymentActions from 'actions/PaymentActions';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';

const getSubscriptionError = (currentSubscription) => {
  const promoProducts = [PREMIUM_ONE_MONTH_PROMO];

  if (!currentSubscription) {
    return null;
  }

  if (promoProducts.includes(currentSubscription.uid) && isExpired(currentSubscription)) {
    return 'Sorry, je kunt maar één keer meedoen aan deze actie.';
  }

  if (isActiveContinuousSubscription(currentSubscription)) {
    return `Je hebt al een abonnement op ${currentSubscription.product.name}`;
  }

  return null;
};

const isSubmitDisabled = (paymentState, error) => {
  const {
    paymentMethods,
    recurring_contracts: recurringContracts,
    selectedPaymentMethod,
    selectedBanks,
  } = paymentState;

  const selectedBank = selectedBanks[selectedPaymentMethod];

  const paymentMethod =
    paymentMethods.find(method => method.code === selectedPaymentMethod) ||
    recurringContracts.find(contract => contract.id === selectedPaymentMethod);
  const paymentMethodSelected = (paymentMethod && !paymentMethod.banks) || selectedBank !== '0';

  return error || !paymentMethod || !paymentMethodSelected;
};

const mapStateToProps = (
  {
    paymentState,
    subscriptionsProductsState,
    subscriptionOrderState,
    subscriptionsState,
    authState,
  },
  ownProps,
) => {
  const { title, buttonText, children } = ownProps;
  const { product } = subscriptionsProductsState;
  const { paymentURLStatus } = subscriptionOrderState;
  const { paymentMethods, selectedPaymentMethod, selectedBanks } = paymentState;
  const currentSubscription = getSubscription(subscriptionsState.subscriptions, product.uid);
  const error = getSubscriptionError(currentSubscription);
  const paymentMethod = paymentMethods.find(method => method.code === selectedPaymentMethod);

  return {
    title,
    children,
    buttonText,
    error,
    paymentURLStatus,
    paymentMethod,
    userCanSelectBank: !!(paymentMethod && paymentMethod.banks),
    isLoading: paymentURLStatus === STATUS_PENDING,
    submitButtonText: buttonText || translate('payment.subscription.continue'),
    isSubmitDisabled: !!isSubmitDisabled(paymentState, error),
    selectedBank: selectedBanks[selectedPaymentMethod],
  };
};
mapStateToProps.stores = {
  PaymentStore,
  SubscriptionsProductsStore,
  SubscriptionOrderStore,
  SubscriptionsStore,
  AuthStore,
};

const actions = {
  onBankChange(selectedBank) {
    const { selectedPaymentMethod, paymentMethods } = PaymentStore.getState();

    PaymentActions.setPaymentMethod(selectedPaymentMethod, selectedBank, paymentMethods);
  },
  onSubmitOptions() {
    const paymentState = PaymentStore.getState();
    const { product } = SubscriptionsProductsStore.getState();
    const { jwt } = SubscriptionOrderStore.getState();
    const { user } = AuthStore.getState();
    const options = {};

    if (shouldGetAutoRenewTrial()) {
      options.successUrl = 'getpremium/channels';
    }

    SubscriptionOrderActions.fetchSubscriptionPaymentURL(paymentState, product, jwt, user, options);
  },
};

export default compose(
  setPropTypes({
    title: PropTypes.string,
    buttonText: PropTypes.string,
    children: PropTypes.node,
    paymentDisclaimer: PropTypes.string,
    ctaDisclaimer: PropTypes.string,
  }),
  lifecycle({
    componentDidMount() {
      const userSubscriptions = SubscriptionsStore.getState().subscriptions;
      const { product } = SubscriptionsProductsStore.getState();
      const { user } = AuthStore.getState();

      if (!userSubscriptions.find(subscription => subscription.uid === product.uid)) {
        SubscriptionActions.fetchUserSubscription.defer(product.uid, user.id);
      }
    },
  }),
  altConnect(mapStateToProps, actions),
)(SubscriptionOptions);



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/containers/SubscriptionOptionsContainer.js