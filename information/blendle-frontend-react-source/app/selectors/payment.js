export function creditcardFormValid(paymentState) {
  const creditcardDetails = paymentState.creditcardDetails;

  const hasError = Object.keys(creditcardDetails).some((fieldName) => {
    const field = creditcardDetails[fieldName];
    return field && field.error;
  });

  return !hasError;
}

export function getSelectedRecurringContract(paymentState) {
  return paymentState.recurring_contracts.find(
    contract => contract.id === paymentState.selectedPaymentMethod,
  );
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/payment.js