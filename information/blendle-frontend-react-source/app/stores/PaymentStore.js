import { STATUS_INITIAL, STATUS_PENDING, STATUS_ERROR, STATUS_OK } from 'app-constants';
import alt from 'instances/altInstance';
import PaymentActions from '../actions/PaymentActions';

class PaymentStore {
  constructor() {
    this.bindActions(PaymentActions);

    this.paymentMethods = [];
    this.status = STATUS_INITIAL;
    this.selectedPaymentMethod = '0';
    this.selectedBanks = {}; // key => value: paymentMethod.code => bank.code
    this.paymentURL = ''; // url to adyen
    this.paymentURLStatus = STATUS_INITIAL;
    this.recurring = false;
    this.returnUrl = '';
    this.recurring_contracts = [];
    this.creditcardDetails = {
      name: {
        value: '',
        error: false,
      },
      cardNumber: {
        value: '',
        error: false,
      },
      month: {
        value: '',
        error: false,
      },
      year: {
        value: '',
        error: false,
      },
      cvcCode: {
        value: '',
        error: false,
      },
      cardType: null,
      lastEditedField: null,
    };
  }

  onSetReturnUrl(returnUrl) {
    this.setState({ returnUrl });
  }

  onFetchPaymentMethods() {
    this.setState({ status: STATUS_PENDING });
  }

  onFetchPaymentMethodsSuccess({ paymentMethods, recurring, activeStep, recurring_contracts }) {
    this.setState({
      status: STATUS_OK,
      paymentMethods,
      recurring,
      activeStep,
      recurring_contracts,
    });
  }

  onFetchPaymentMethodsError() {
    this.setState({ status: STATUS_ERROR });
  }

  onSetPaymentMethod({ selectedPaymentMethod, selectedBank }) {
    this.setState({
      selectedPaymentMethod,
      selectedBanks: {
        ...this.selectedBanks,
        [selectedPaymentMethod]: selectedBank,
      },
    });
  }

  onSetRecurringContract({ recurring }) {
    this.setState({ recurring });
  }

  onFetchPaymentURL() {
    this.setState({ paymentURLStatus: STATUS_PENDING });
  }

  onFetchPaymentUrlError() {
    this.setState({
      paymentURLStatus: STATUS_ERROR,
    });
  }

  onFetchPaymentURLSuccess({ paymentURL, activeStep }) {
    this.setState({
      paymentURL,
      activeStep,
      paymentURLStatus: STATUS_OK,
    });
  }

  onSetCreditcardValue({ key, value }) {
    const field = this.creditcardDetails[key];
    this.setState({
      creditcardDetails: {
        ...this.creditcardDetails,
        lastEditedField: key,
        [key]: {
          error: false,
          value,
        },
      },
    });
  }

  onSetCreditcardNumber({ value, cardType }) {
    this.setState({
      creditcardDetails: {
        ...this.creditcardDetails,
        cardNumber: {
          error: false,
          value,
        },
        lastEditedField: 'cardNumber',
        cardType,
      },
    });
  }

  onValidateFormField({ fieldName, error, value }) {
    this.setState({
      creditcardDetails: {
        ...this.creditcardDetails,
        [fieldName]: {
          ...this.creditcardDetails[fieldName],
          error,
          value,
        },
        lastEditedField: null,
      },
    });
  }

  onValidateCreditcardDetails({ cvc, expiryMonth, expiryYear, number, holderName }) {
    this.setState({
      creditcardDetails: {
        ...this.creditcardDetails,
        cvcCode: {
          ...this.creditcardDetails.cvcCode,
          error: !cvc,
        },
        month: {
          ...this.creditcardDetails.month,
          error: !expiryMonth,
        },
        year: {
          ...this.creditcardDetails.year,
          error: !expiryYear,
        },
        cardNumber: {
          ...this.creditcardDetails.cardNumber,
          error: !number,
        },
        name: {
          ...this.creditcardDetails.name,
          error: !holderName,
        },
      },
    });
  }
}

export default alt.createStore(PaymentStore, 'PaymentStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/PaymentStore.js