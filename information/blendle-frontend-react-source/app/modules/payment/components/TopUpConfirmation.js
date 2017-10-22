import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import formatCurrency from 'helpers/formatcurrency';
import Button from 'components/Button';

class TopUpConfirmation extends React.Component {
  static propTypes = {
    selectedPaymentMethod: PropTypes.string.isRequired,
    selectedBank: PropTypes.string,
    selectedAmount: PropTypes.number.isRequired,
    transactionFees: PropTypes.object.isRequired,
    paymentURL: PropTypes.string.isRequired,
    paymentMethods: PropTypes.array.isRequired,
    firstDepositGift: PropTypes.bool.isRequired,
    paypalDepositGift: PropTypes.object,
    topUpLoading: PropTypes.bool.isRequired,
    onSubmitConfirmation: PropTypes.func.isRequired,
    onSubmitCreditcard: PropTypes.func.isRequired,
    recurringContract: PropTypes.object,
  };

  _renderGifts() {
    const gifts = [];

    if (this.props.paypalDepositGift && this.props.paypalDepositGift.unlocked) {
      gifts.push(
        <li className="top-up-confirmation-row top-up-confirmation-paypal-gift">
          <span className="name">
            {translate('payment.gifts.prefix')} {translate('payment.gifts.givers.paypal')}
          </span>
          <span className="amount">{formatCurrency(this.props.paypalDepositGift.gift_amount)}</span>
        </li>,
      );
    }

    if (this.props.firstDepositGift) {
      gifts.push(
        <li className="top-up-confirmation-row top-up-confirmation-first-deposit">
          <span className="name">
            {translate('payment.gifts.prefix')} {translate('payment.gifts.givers.blendle')}
          </span>
          <span className="amount">{formatCurrency(2.5)}</span>
        </li>,
      );
    }

    return gifts;
  }

  _renderSum() {
    const payTotal =
      parseFloat(this.props.selectedAmount) +
      parseFloat(this.props.transactionFees[this.props.selectedAmount] || 0);
    let getTotal = parseFloat(this.props.selectedAmount) + (this.props.firstDepositGift ? 2.5 : 0);
    if (this.props.paypalDepositGift && this.props.paypalDepositGift.unlocked) {
      getTotal += parseFloat(this.props.paypalDepositGift.gift_amount);
    }

    let pay = '';
    if (payTotal !== getTotal) {
      pay = ` ${translate('payment.text.credit_for')} ${formatCurrency(payTotal)}`;
    }

    return (
      <ul className="top-up-confirmation-sum">
        <li className="base top-up-confirmation-row">
          <span className="name">{translate('payment.text.upgrade')}</span>
          <span className="amount">{formatCurrency(this.props.selectedAmount)}</span>
        </li>
        <li className="fee top-up-confirmation-row">
          <span className="name">{translate('payment.text.transaction_fee')}</span>
          <span className="amount">
            {formatCurrency(this.props.transactionFees[this.props.selectedAmount])}
          </span>
        </li>
        {this._renderGifts()}
        <li className="total top-up-confirmation-row">
          <span className="name">{translate('payment.text.total')}</span>
          <span className="amount">
            <span className="get">{formatCurrency(getTotal)}</span>
            {pay}
          </span>
        </li>
      </ul>
    );
  }

  _renderCheckoutText() {
    const paymentMethod = this.props.paymentMethods.find(
      method => method.code === this.props.selectedPaymentMethod,
    );

    if (paymentMethod.code === 'ideal') {
      const bankName = paymentMethod.banks.find(bank => bank.code === this.props.selectedBank).name;
      return translate('payment.goto_payment.continue_to', [bankName]);
    } else if (paymentMethod.code === 'paypal') {
      return translate('payment.goto_payment.continue_to', ['PayPal']);
    } else if (paymentMethod.code === 'directEbanking') {
      return translate('payment.goto_payment.continue_to', ['Sofort Banking']);
    } else if (paymentMethod.code === 'sepadirectdebit') {
      return translate('payment.goto_payment.continue_to', ['SEPA Direct Debit']);
    } else if (paymentMethod.code === 'giropay') {
      return translate('payment.goto_payment.continue_to', [translate('payment.methods.giropay')]);
    } else if (paymentMethod.code === 'creditcard') {
      const bankCode = paymentMethod.banks.find(bank => bank.code === this.props.selectedBank).code;
      return translate('payment.goto_payment.continue_with', [
        translate(`payment.methods.${bankCode}`),
      ]);
    }
  }

  _renderButton() {
    const paymentMethod = this.props.paymentMethods.find(
      method => method.code === this.props.selectedPaymentMethod,
    );
    const isRecurringContract = this.props.paymentURL === '' && this.props.recurringContract;
    const isInlineCreditcard = paymentMethod && paymentMethod.code === 'creditcard';

    // paymentURL is an empty string when user wants to checkout with a contract
    if (isRecurringContract || isInlineCreditcard) {
      const clickHandler = isRecurringContract
        ? () => this.props.onSubmitConfirmation(this.props.recurringContract)
        : () => this.props.onSubmitCreditcard();

      return (
        <Button
          onClick={clickHandler}
          className="btn btn-green btn-fullwidth"
          loading={this.props.topUpLoading}
        >
          {translate('payment.goto_payment.pay_directly')}
        </Button>
      );
    }

    return (
      <a href={this.props.paymentURL} className="btn btn-green btn-fullwidth">
        {this._renderCheckoutText()}
      </a>
    );
  }

  render() {
    return (
      <div className="top-up-confirmation">
        <h2 className="top-up-confirmation-header">{translate('payment.sum.title')}</h2>
        {this._renderSum()}
        <p className="disclaimer">{translate('payment.disclaimer')}</p>
        {this._renderButton()}
      </div>
    );
  }
}

export default TopUpConfirmation;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/TopUpConfirmation.js