import React from 'react';
import PropTypes from 'prop-types';

class DepositRow extends React.Component {
  static propTypes = {
    date: PropTypes.string,
    text: PropTypes.string.isRequired,
  };

  _renderDate = () => {
    if (this.props.date) {
      return <div className="date">{this.props.date}</div>;
    }

    return null;
  };

  render() {
    return (
      <li className="deposit">
        {this._renderDate()}
        <div className="deposit">{this.props.text}</div>
      </li>
    );
  }
}

export default DepositRow;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/TransactionRow.js