import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import formatCurrency from 'helpers/formatcurrency';
import moment from 'moment';
import Link from 'components/Link';

class TransactionRow extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    refund: PropTypes.bool.isRequired,
    target: PropTypes.string,
  };

  render() {
    const refund = classNames('price', {
      refund: this.props.refund,
    });

    const target = this.props.target || '_self';

    return (
      <li className="transaction">
        <div className="date">{moment(this.props.date).calendar()}</div>
        <Link className="head" href={this.props.href} target={target}>
          <span className="provider">{this.props.text}</span>
          <span className={refund}>
            &nbsp;
            {this.props.refund ? '+' : ''}
            {formatCurrency(this.props.amount)}
          </span>
        </Link>
      </li>
    );
  }
}

export default TransactionRow;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/PurchaseRow.js