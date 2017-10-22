import alt from 'instances/altInstance';
import PaymentManager from 'managers/payment';
import Analytics from 'instances/analytics';
import Cookies from 'cookies-js';
import TopUpActions from 'actions/TopUpActions';
import { validateCreditcard } from 'helpers/adyenCse';
import { getSelectedRecurringContract } from 'selectors/payment';

const CREDIT_CARD_TYPE_REGEX = {
  // Source: http://stackoverflow.com/a/72801/1890026
  visa: /^4/,
  mc: /^5/,
  amex: /^3[47]/,
  discover: /^6/,
};

function setPaymentRequestCookie(method, paymentState, topUpState, rest) {
  Cookies.set(
    'paymentRequest',
    JSON.stringify({
      method,
      amount: topUpState.selectedAmount,
      recurring: !!paymentState.recurring_enabled,
      returnUrl: paymentState.returnUrl,
      ...rest,
    }),
  );
}

export default alt.createActions({
  fetchPaymentMethodsSuccess: x => x,
  fetchPaymentMethodsError: x => x,
  setReturnUrl: x => x,
  validateFormField: x => x,

  fetchPaymentMethods(user) {
    return (dispatch) => {
      dispatch();

      return Promise.all([
        PaymentManager.getPaymentMethodsProcessed(user),
        PaymentManager.getRecurringContract(user),
      ])
        .then(([paymentMethods, recurring]) => {
          // Check if last_payment_method and last_bank are still available
          const prefLastPaymentMethod = user.get('preferences').last_payment_method;
          const prefLastBank = user.get('preferences').last_bank;
          let lastPaymentMethod = paymentMethods.find(
            paymentMethod => paymentMethod.code === prefLastPaymentMethod,
          );

          // Remove PayPal recurring contracts when user has more than 1 because the user can't tell the difference.
          const payPalContract = recurring._embedded.recurring_contracts.filter(
            ({ variant }) => variant === 'paypal',
          );

          if (payPalContract.length > 1) {
            recurring._embedded.recurring_contracts = recurring._embedded.recurring_contracts.filter(
              ({ variant }) => variant !== 'paypal',
            );
          }

          // @FEATURE recurring_contract top up
          if (recurring._embedded.recurring_contracts.length > 0) {
            lastPaymentMethod = recurring._embedded.recurring_contracts[0].id;
          }

          let lastBank;
          if (lastPaymentMethod && lastPaymentMethod.banks) {
            lastBank = lastPaymentMethod.banks.find(bank => bank.code === prefLastBank);
          }

          if (lastPaymentMethod && lastPaymentMethod.code) {
            lastPaymentMethod = lastPaymentMethod.code;
          }

          this.setPaymentMethod(
            lastPaymentMethod,
            lastBank ? lastBank.code : undefined,
            paymentMethods,
          );

          // Preselect ideal for the first order if it's available
          if (user.get('orders') === 0 && paymentMethods.find(pm => pm.code === 'ideal')) {
            this.setPaymentMethod('ideal', undefined, paymentMethods);
          }

          TopUpActions.setRecurringRequestContract(recurring.recurring_enabled);

          return {
            paymentMethods,
            recurring: recurring.recurring_enabled,
            recurring_contracts: recurring._embedded.recurring_contracts,
          };
        })
        .then((payload) => {
          this.fetchPaymentMethodsSuccess(payload);
          return payload;
        })
        .catch((error) => {
          this.fetchPaymentMethodsError(error);

          throw error;
        });
    };
  },

  /**
   * Also sets selected bank when method is creditcard to first creditcard in banks array
   * @param {string} selectedPaymentMethod id
   * @param {string} selectedBank id
   * @param {array} paymentMethods
   */
  setPaymentMethod(selectedPaymentMethod = '0', selectedBank = '0', paymentMethods) {
    if (selectedPaymentMethod === 'creditcard' && selectedBank === '0') {
      const availableBanks = paymentMethods.find(method => method.code === selectedPaymentMethod)
        .banks;
      selectedBank = availableBanks[0].code;
    }

    return { selectedPaymentMethod, selectedBank };
  },

  /**
   * Enable or disable recurring (sends request to server)
   */
  setRecurringContract(user, enabled) {
    return (dispatch) => {
      PaymentManager.setRecurringContract(user, enabled)
        .then(data => PaymentManager.getRecurringState(data))
        .then(recurring => dispatch({ recurring }));
    };
  },

  validateCreditcardDetails(paymentState, topUpState) {
    return (dispatch) => {
      const { creditcardDetails, selectedPaymentMethod } = paymentState;

      validateCreditcard({
        cardNumber: creditcardDetails.cardNumber.value,
        holderName: creditcardDetails.name.value,
        cvc: creditcardDetails.cvcCode.value,
        expiryMonth: creditcardDetails.month.value,
        expiryYear: creditcardDetails.year.value,
      }).then((validationDetails) => {
        if (validationDetails.valid) {
          TopUpActions.setActiveStep('confirmation');
        }

        Analytics.track('Payment Request', {
          method: selectedPaymentMethod,
          amount: topUpState.selectedAmount,
          recurring: !!paymentState.recurring_enabled,
          bank: creditcardDetails.cardType,
        });

        setPaymentRequestCookie(selectedPaymentMethod, paymentState, topUpState, {
          bank: creditcardDetails.cardType,
        });

        dispatch(validationDetails);
      });
    };
  },

  /**
   * @param {object} paymentState current state
   * @param {object} topUpState current TopUp state
   * @param {object} user
   */
  fetchPaymentURL(paymentState, topUpState, user) {
    return (dispatch) => {
      dispatch();

      // User wants to pay with a recurring contract
      if (getSelectedRecurringContract(paymentState)) {
        this.fetchPaymentURLSuccess(paymentState, topUpState, '');

        return null;
      }

      const options = {
        success_url: 'payment/success',
        pending_url: 'payment/pending',
        cancel_url: 'payment/cancelled',
        method: paymentState.selectedPaymentMethod,
        recurring: topUpState.recurringRequest,
        amount: topUpState.selectedAmount,
      };

      if (paymentState.selectedBanks[paymentState.selectedPaymentMethod]) {
        options.bank = paymentState.selectedBanks[paymentState.selectedPaymentMethod];
      }

      user.savePreferences({
        last_payment_method: options.method,
        last_bank: options.bank,
      });

      PaymentManager.fetchPaymentURL(user, options).then((paymentURL) => {
        this.fetchPaymentURLSuccess(paymentState, topUpState, paymentURL);
      });
    };
  },

  /**
   * @param {object} paymentState current state
   * @param {object} topUpState current TopUp state
   * @param {string} paymentURL adyen url
   */
  fetchPaymentURLSuccess(paymentState, topUpState, paymentURL) {
    const bank = { bank: paymentState.selectedBanks[paymentState.selectedPaymentMethod] };
    const recurringContract = getSelectedRecurringContract(paymentState);

    const method = recurringContract
      ? `${recurringContract.variant}-recurring`
      : paymentState.selectedPaymentMethod;

    Analytics.track('Payment Request', {
      method,
      amount: topUpState.selectedAmount,
      recurring: !!paymentState.recurring_enabled,
      ...(bank.bank !== '0' ? bank : undefined),
    });

    setPaymentRequestCookie(method, paymentState, topUpState, {
      ...(bank.bank !== '0' ? bank : undefined),
    });

    TopUpActions.setActiveStep('confirmation');

    return { paymentURL };
  },

  setCreditcardValue(key, value) {
    return { key, value };
  },

  setCreditcardNumber(value) {
    const cardType = Object.keys(CREDIT_CARD_TYPE_REGEX).find(key =>
      CREDIT_CARD_TYPE_REGEX[key].test(value),
    );
    return { value, cardType };
  },

  validateName(value) {
    return this.validateFormField({
      fieldName: 'name',
      error: !value.length,
      value,
    });
  },

  validateCardNumber(value, cardType) {
    const requiredLength = cardType === 'amex' ? 15 : 16;
    return this.validateFormField({
      fieldName: 'cardNumber',
      error: !cardType || value.length !== requiredLength,
      value,
    });
  },

  validateYear(value) {
    return this.validateFormField({
      fieldName: 'year',
      error: value.length !== 2,
      value,
    });
  },

  validateMonth(value) {
    const month = parseInt(value, 10);
    const formattedValue = `0${value}`.substr(-2);

    return this.validateFormField({
      fieldName: 'month',
      error: month > 12,
      value: formattedValue,
    });
  },

  validateCvc(value, cardType) {
    const requiredLength = cardType === 'amex' ? 4 : 3;
    return this.validateFormField({
      fieldName: 'cvcCode',
      error: value.length !== requiredLength,
      value,
    });
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/PaymentActions.js