import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Select2';
import { translate } from 'instances/i18n';

class SelectPaymentMethod extends Component {
  static propTypes = {
    recurringContracts: PropTypes.array.isRequired,
    selectedPaymentMethod: PropTypes.string.isRequired,
    paymentMethods: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  _renderPlaceholder() {
    return (
      <option key="0" value="0" selected={this.props.selectedPaymentMethod === '0'}>
        {translate('elements.payment.method.pick_method')}
      </option>
    );
  }

  _renderRecurringContractLabel(contract) {
    const { bank_name: bankName } = contract.bank_account;

    if (bankName) {
      return bankName;
    }

    /**
     * PayPal and creditcard contract don't have a bank_name property
     * For paypal look for paypal in paymentMethods and return name
     * For creditcard look for the "bank" in creditcard "banks" and return name
    */
    const method = this.props.paymentMethods.find(
      ({ code, banks = [] }) =>
        code === contract.variant || banks.some(bank => bank.code === contract.variant),
    );

    if (!method) {
      return contract.variant;
    }

    if (method.banks) {
      return method.banks.find(({ code }) => code === contract.variant).name;
    }

    return method.name;
  }

  _renderRecurringContracts() {
    return this.props.recurringContracts.map((contract) => {
      const { last_four_digits: lastFourDigits } = contract.bank_account;

      const prefix = lastFourDigits ? `****${lastFourDigits} ` : '';

      return (
        <option
          value={contract.id}
          key={contract.id}
          selected={this.props.selectedPaymentMethod === contract.id}
        >
          {this._renderRecurringContractLabel(contract)}
          <span className="top-up-direct">
            {` (${prefix}${translate('elements.payment.method.pay_direct')})`}
          </span>
        </option>
      );
    });
  }

  _renderPaymentMethods() {
    return this.props.paymentMethods.map(({ code, name }) => (
      <option value={code} selected={this.props.selectedPaymentMethod === code} key={code}>
        {name}
      </option>
    ));
  }

  _renderOptions() {
    return [
      this._renderPlaceholder(),
      ...this._renderRecurringContracts(),
      ...this._renderPaymentMethods(),
    ];
  }

  render() {
    return (
      <Select className="dropdown-payment-methods" onChange={this.props.onSelect}>
        {this._renderOptions()}
      </Select>
    );
  }
}

export default SelectPaymentMethod;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SelectPaymentMethod.js