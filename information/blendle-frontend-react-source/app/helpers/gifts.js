import _ from 'lodash';

export function eligibleFirstDepositGift(paymentMethods, selectedAmount) {
  const paymentMethod = paymentMethods[0];

  if (_.get(paymentMethod, ['gifts', 'blendle_first_deposit_gift', 'eligible'])) {
    const gift = paymentMethod.gifts.blendle_first_deposit_gift;
    return selectedAmount >= parseFloat(gift.minimum_deposit_amount);
  }

  return false;
}

export function eligiblePayPalDepositGift(paymentMethods, selectedAmount, selectedMethod) {
  const paypalPaymentMethod = paymentMethods.filter(method => method.code === 'paypal')[0];

  if (_.get(paypalPaymentMethod, ['gifts', 'paypal_gift', 'eligible'])) {
    let unlocked = false;

    if (
      selectedAmount >=
        parseFloat(
          _.get(paypalPaymentMethod, ['gifts', 'paypal_gift', 'minimum_deposit_amount']),
        ) &&
      selectedMethod === 'paypal'
    ) {
      unlocked = true;
    }

    return _.extend(paypalPaymentMethod.gifts.paypal_gift, {
      unlocked,
    });
  }

  return null;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/gifts.js