import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import formatCurrency from 'helpers/formatcurrency';

class SellingPoint extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    firstDepositGift: PropTypes.bool.isRequired,
    paypalDepositGift: PropTypes.object,
    selectedAmount: PropTypes.number.isRequired,
  };

  _renderGift() {
    if (this.props.paypalDepositGift) {
      return translate('payment.sellingpoints.paypal_gift', {
        minimum_deposit: formatCurrency(10),
        gift: formatCurrency(2.5),
      });
    }

    if (this.props.firstDepositGift) {
      return translate('payment.sellingpoints.blendle', {
        gift: formatCurrency(2.5),
      });
    }

    if (this.props.user.get('balance') <= 0) {
      return translate('payment.text.negative_balance');
    }

    return null;
  }

  render() {
    const gift = this._renderGift();

    if (gift) {
      return (
        <h1 className="sellingpoint" dangerouslySetInnerHTML={{ __html: this._renderGift() }} />
      );
    }

    return <h1 className="sellingpoint">{translate('payment.text.title')}</h1>;
  }
}

export default SellingPoint;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SellingPoint.js