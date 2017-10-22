import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Select2';
import formatCurrency from 'helpers/formatcurrency';
import { translate } from 'instances/i18n';

class SelectAmount extends React.Component {
  static propTypes = {
    amounts: PropTypes.array.isRequired,
    selectedAmount: PropTypes.number.isRequired,
    transactionFees: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  _renderFee(amount) {
    if (this.props.transactionFees[amount]) {
      return (
        <span className="fee">
          ({formatCurrency(this.props.transactionFees[amount])}
          &nbsp;{translate('payment.text.transaction_fee')})
        </span>
      );
    }

    return null;
  }

  _renderAmountOptions() {
    return this.props.amounts.map(amount => (
      <option value={amount} selected={this.props.selectedAmount === amount} key={amount}>
        <span className="block">{formatCurrency(amount)}</span>
        {this._renderFee(amount)}
      </option>
    ));
  }

  render() {
    return (
      <Select className="dropdown-amounts" onChange={this.props.onSelect}>
        {this._renderAmountOptions()}
      </Select>
    );
  }
}

export default SelectAmount;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SelectAmount.js