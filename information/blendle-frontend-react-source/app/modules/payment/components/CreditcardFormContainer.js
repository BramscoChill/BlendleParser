import React from 'react';
import PaymentStore from 'stores/PaymentStore';
import PaymentActions from 'actions/PaymentActions';
import AltContainer from 'alt-container';
import CreditcardForm from './CreditcardForm';

const numericRegex = /^\d+$/;

export default class CreditcardFormContainer extends React.Component {
  _onNumberInputChange = (e) => {
    const { value } = e.target;

    if (value.length && !numericRegex.test(value)) {
      return;
    }

    this._onTextInputChange(e);
  };

  _onCardNumberInputChange(e) {
    const { value } = e.target;
    const trimmedValue = value.replace(/[\s-]/g, '');
    if ((trimmedValue.length && !numericRegex.test(trimmedValue)) || trimmedValue.length > 16) {
      return;
    }

    PaymentActions.setCreditcardNumber(trimmedValue);
  }

  _onTextInputChange(e) {
    const { name, value } = e.target;

    PaymentActions.setCreditcardValue(name, value);
  }

  _onNameBlur() {
    const { creditcardDetails } = PaymentStore.getState();
    const name = creditcardDetails.name.value;

    if (!name) {
      return;
    }

    PaymentActions.validateName(name);
  }

  _onCardNumberBlur() {
    const { creditcardDetails } = PaymentStore.getState();
    const cardNumber = creditcardDetails.cardNumber.value;
    const cardType = creditcardDetails.cardType;

    if (!cardNumber) {
      return;
    }

    PaymentActions.validateCardNumber(cardNumber, cardType);
  }

  _onCvcBlur() {
    const { creditcardDetails } = PaymentStore.getState();
    const cvcCode = creditcardDetails.cvcCode.value;
    const cardType = creditcardDetails.cardType;

    if (!cvcCode) {
      return;
    }

    PaymentActions.validateCvc(cvcCode, cardType);
  }

  _onMonthBlur() {
    const { creditcardDetails } = PaymentStore.getState();
    const month = creditcardDetails.month.value;

    if (!month) {
      return;
    }

    PaymentActions.validateMonth(month);
  }

  _onYearBlur() {
    const { creditcardDetails } = PaymentStore.getState();
    const year = creditcardDetails.year.value;

    if (!year) {
      return;
    }

    PaymentActions.validateYear(year);
  }

  _renderCreditcardForm = (paymentStore) => {
    const { creditcardDetails } = paymentStore;

    return (
      <CreditcardForm
        onNumberInputChange={this._onNumberInputChange}
        onTextInputChange={this._onTextInputChange}
        onCardNumberInputChange={this._onCardNumberInputChange}
        creditcardDetails={creditcardDetails}
        onNameBlur={this._onNameBlur}
        onCardNumberBlur={this._onCardNumberBlur}
        onCvcBlur={this._onCvcBlur}
        onMonthBlur={this._onMonthBlur}
        onYearBlur={this._onYearBlur}
      />
    );
  };

  render() {
    return <AltContainer store={PaymentStore} render={this._renderCreditcardForm.bind(this)} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/CreditcardFormContainer.js