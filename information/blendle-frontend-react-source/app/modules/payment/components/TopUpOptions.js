import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ToggleButton from 'components/buttons/Toggle';
import PaymentDetailsMessage from './PaymentDetailsMessage';
import { translate, getCurrencyWord, formatCurrency } from 'instances/i18n';
import classNames from 'classnames';
import SelectBank from 'modules/payment/components/SelectBank';
import SelectPaymentMethod from 'modules/payment/components/SelectPaymentMethod';
import SelectAmount from 'modules/payment/components/SelectAmount';
import SellingPointContainer from 'modules/payment/containers/SellingPointContainer';
import CreditCardFormContainer from 'modules/payment/components/CreditcardFormContainer';
import { RECURRING_MINIMAL_AMOUNT } from 'app-constants';

function isNewLayout() {
  // All users get the new layout, because we're still in the process of measuring the baseline.
  // This will be an AB-test in the near future.

  return true;
}

class TopUpOptions extends React.Component {
  static propTypes = {
    paymentMethods: PropTypes.array.isRequired,
    selectedPaymentMethod: PropTypes.string.isRequired,
    selectedAmount: PropTypes.number.isRequired,
    selectedBank: PropTypes.string,
    amounts: PropTypes.arrayOf(PropTypes.number).isRequired,
    transactionFees: PropTypes.object.isRequired,
    onAmountChange: PropTypes.func.isRequired,
    onPaymentMethodChange: PropTypes.func.isRequired,
    onBankChange: PropTypes.func.isRequired,
    onSubmitOptions: PropTypes.func.isRequired,
    paymentURLLoading: PropTypes.bool.isRequired,
    recurring: PropTypes.bool.isRequired,
    validCreditcard: PropTypes.bool.isRequired,
    onSetRecurringContract: PropTypes.func.isRequired,
    recurringContracts: PropTypes.array.isRequired,
  };

  _renderSelectBank() {
    const paymentMethod = this.props.paymentMethods.find(
      method => method.code === this.props.selectedPaymentMethod,
    );

    if (paymentMethod && paymentMethod.code === 'creditcard') {
      return <CreditCardFormContainer />;
    }

    if (paymentMethod && paymentMethod.banks) {
      return (
        <SelectBank
          onSelect={this.props.onBankChange}
          paymentMethod={paymentMethod}
          selectedBank={this.props.selectedBank}
        />
      );
    }
  }

  _renderRecurring() {
    if (isNewLayout()) {
      return (
        <div className="recurring-toggle-container" onClick={this.props.onSetRecurringContract}>
          <input
            type="checkbox"
            className="recurring-toggle-checkbox"
            checked={this.props.recurring}
          />
          <div>
            <strong>{translate('payment.recurring.option_title')}</strong>
            <label className="recurring-toggle-label">
              {translate('payment.recurring.option_body', {
                amount: formatCurrency(RECURRING_MINIMAL_AMOUNT),
              })}
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="recurring-toggle-container">
        <ToggleButton checked={this.props.recurring} onToggle={this.props.onSetRecurringContract} />
        <label
          className="recurring-toggle-label"
          onClick={this.props.onSetRecurringContract}
          dangerouslySetInnerHTML={{
            __html: translate('payment.labels.recurring', {
              currency: getCurrencyWord(),
            }),
          }}
        />
      </div>
    );
  }

  _renderSubmitButton() {
    const transactionFee = this.props.transactionFees[this.props.selectedAmount] || 0;
    const amount = parseFloat(this.props.selectedAmount) + transactionFee;
    const paymentMethod =
      this.props.paymentMethods.find(method => method.code === this.props.selectedPaymentMethod) ||
      this.props.recurringContracts.find(
        contract => contract.id === this.props.selectedPaymentMethod,
      );

    const isInlineCreditcard = paymentMethod && paymentMethod.code === 'creditcard';
    const enabled =
      paymentMethod &&
      (!paymentMethod.banks || this.props.selectedBank !== '0') &&
      (!isInlineCreditcard || this.props.validCreditcard);

    const className = classNames('btn-green', 'btn-fullwidth', 'btn-checkout', {
      secure: isInlineCreditcard,
    });

    return (
      <Button
        disabled={!enabled}
        loading={this.props.paymentURLLoading}
        className={className}
        onClick={this.props.onSubmitOptions}
      >
        {translate('payment.buttons.submit', [formatCurrency(amount)])}
      </Button>
    );
  }

  _renderPaymentDetailsMessage(isVisible) {
    if (!isVisible) {
      return null;
    }

    return <PaymentDetailsMessage />;
  }

  render() {
    const className = classNames('top-up-options', {
      'new-recurring-layout': isNewLayout(),
    });

    return (
      <div className={className}>
        <SellingPointContainer />
        <div className="top-up-options-dropdowns">
          <SelectAmount
            amounts={this.props.amounts}
            selectedAmount={this.props.selectedAmount}
            transactionFees={this.props.transactionFees}
            onSelect={this.props.onAmountChange}
          />
          <SelectPaymentMethod
            recurringContracts={this.props.recurringContracts}
            paymentMethods={this.props.paymentMethods}
            selectedPaymentMethod={this.props.selectedPaymentMethod}
            onSelect={this.props.onPaymentMethodChange}
          />
          {this._renderSelectBank()}
        </div>
        <div className="top-up-options-actions">
          {this._renderRecurring()}
          {this._renderSubmitButton()}
        </div>
        {this._renderPaymentDetailsMessage(isNewLayout())}
      </div>
    );
  }
}

export default TopUpOptions;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/TopUpOptions.js