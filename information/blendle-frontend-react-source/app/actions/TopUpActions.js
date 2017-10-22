import alt from 'instances/altInstance';
import PaymentManager from 'managers/payment';
import Auth from 'controllers/auth';
import { history } from 'byebye';
import { encryptCreditcard } from 'helpers/adyenCse';

export default alt.createActions({
  resetState: () => true,

  setActiveStep: x => x,

  setAmount(amount) {
    return parseInt(amount);
  },

  /**
   * Set the value for the payment dialogue (don't send request)
   */
  setRecurringRequestContract(enabled) {
    return { recurringRequest: enabled };
  },

  topUp(amount, recurringContract, isRecurringRequest, user) {
    PaymentManager.directTopUp(
      {
        amount,
        recurringContractId: recurringContract.id,
        recurring: isRecurringRequest,
      },
      user.id,
    )
      .then(this.topUpSuccess)
      .catch((errorMessage) => {
        this.topUpError(errorMessage);

        throw errorMessage;
      });

    return null;
  },

  topupCreditcard(amount, creditcardDetails, isRecurringRequest, user) {
    encryptCreditcard({
      cardNumber: creditcardDetails.cardNumber.value,
      cvc: creditcardDetails.cvcCode.value,
      holderName: creditcardDetails.name.value,
      expiryMonth: creditcardDetails.month.value,
      expiryYear: creditcardDetails.year.value,
    }).then((encryptedCreditcardDetails) => {
      PaymentManager.directTopUp(
        {
          amount,
          adyen_encrypted_data: encryptedCreditcardDetails,
          method: creditcardDetails.cardType,
          recurring: isRecurringRequest,
        },
        user.id,
      )
        .then(this.topUpSuccess)
        .catch((errorMessage) => {
          this.topUpError(errorMessage);

          throw errorMessage;
        });
    });

    return null;
  },

  topUpSuccess(result) {
    // Refresh for new embedded user with updated balance
    Auth.renewJWT().then(() =>
      history.navigate('/payment/success', { trigger: true, replace: true }),
    );

    return result;
  },

  topUpError(errorMessage) {
    history.navigate('/payment/cancelled', { trigger: true });

    return errorMessage;
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/TopUpActions.js