import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Select2';
import { translate } from 'instances/i18n';

class SelectBank extends React.Component {
  static propTypes = {
    paymentMethod: PropTypes.object.isRequired,
    selectedBank: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  _renderBankOptions() {
    const bankElements = this.props.paymentMethod.banks.map(bank => (
      <option key={bank.code} value={bank.code} selected={this.props.selectedBank === bank.code}>
        {bank.name}
      </option>
    ));

    if (this.props.paymentMethod.code !== 'creditcard') {
      bankElements.unshift(
        <option key="0" value="0" selected={this.props.selectedBank === '0'}>
          {translate('elements.payment.method.pick_bank')}
        </option>,
      );
    }

    return bankElements;
  }

  render() {
    return (
      <Select className="dropdown-banks" onChange={this.props.onSelect}>
        {this._renderBankOptions()}
      </Select>
    );
  }
}

export default SelectBank;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SelectBank.js