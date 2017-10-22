import { STATUS_INITIAL, STATUS_PENDING, STATUS_ERROR, STATUS_OK } from 'app-constants';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';
import alt from 'instances/altInstance';

class SubscriptionOrderStore {
  constructor() {
    this.bindActions(SubscriptionOrderActions);

    this.state = {
      status: STATUS_INITIAL,
      paymentURLStatus: STATUS_INITIAL,
      activeStep: 'options', // which component is active (options or confirmation)
      paymentURL: '', // url to adyen
      jwt: null,
      trialStatus: STATUS_INITIAL,
      affiliateStatus: STATUS_INITIAL,
      directPaymentStatus: STATUS_INITIAL,
      directPaymentError: null,
    };
  }

  onDirectPayment() {
    this.setState({ directPaymentStatus: STATUS_PENDING, directPaymentError: null });
  }

  onDirectPaymentSuccess() {
    this.setState({ directPaymentStatus: STATUS_OK });
  }

  onDirectPaymentError(error) {
    this.setState({ directPaymentStatus: STATUS_ERROR, directPaymentError: error });
  }

  onRetry() {
    this.setState({ directPaymentStatus: STATUS_PENDING });
  }

  onFetchSubscriptionPaymentURL() {
    this.setState({ paymentURLStatus: STATUS_PENDING });
  }

  onFetchSubscriptionPaymentURLSuccess({ paymentURL, activeStep }) {
    this.setState({
      paymentURL,
      activeStep,
      paymentURLStatus: STATUS_OK,
    });
  }

  onFetchSubscriptionPaymentURLError() {
    this.setState({ paymentURLStatus: STATUS_ERROR });
  }

  onSetActiveStep(activeStep) {
    this.setState({ activeStep, directPaymentError: null });
  }

  onCreateOrder() {
    this.setState({ status: STATUS_PENDING });
  }

  onCreateOrderSuccess(data) {
    const { redirect_url } = data;
    const orderSuccessData = data.redirect_url ? { redirect_url } : { jwt: data };

    this.setState({
      ...orderSuccessData,
      status: STATUS_OK,
    });
  }

  onStartTrial() {
    this.setState({
      trialStatus: STATUS_PENDING,
    });
  }

  onStartTrialSuccess() {
    this.setState({ trialStatus: STATUS_OK });
  }

  onStartTrialFailure(error) {
    this.setState({
      trialStatus: STATUS_ERROR,
      error,
    });
  }

  onStartAffiliateSubscription() {
    this.setState({
      affiliateStatus: STATUS_PENDING,
    });
  }

  onStartAffiliateSubscriptionSuccess() {
    this.setState({ affiliateStatus: STATUS_OK });
  }

  onStartAffiliateSubscriptionFailure(error) {
    this.setState({
      affiliateStatus: STATUS_ERROR,
      error,
    });
  }
}

export default alt.createStore(SubscriptionOrderStore, 'SubscriptionOrderStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/SubscriptionOrderStore.js