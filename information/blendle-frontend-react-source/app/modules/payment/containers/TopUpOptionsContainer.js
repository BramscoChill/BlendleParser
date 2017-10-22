import React from 'react';
import Analytics from 'instances/analytics';
import AltContainer from 'alt-container';
import TopUpOptions from 'modules/payment/components/TopUpOptions';
import PaymentStore from 'stores/PaymentStore';
import PaymentActions from 'actions/PaymentActions';
import TopUpActions from 'actions/TopUpActions';
import TopUpStore from 'stores/TopUpStore';
import AuthStore from 'stores/AuthStore';
import { creditcardFormValid, getSelectedRecurringContract } from 'selectors/payment';
import { STATUS_PENDING } from 'app-constants';

function toggleRecurring(enabled, paymentState) {
  const eventName = `Toggle Recurring Payment ${enabled ? 'On' : 'Off'}`;
  const bank = { bank: paymentState.selectedBanks[paymentState.selectedPaymentMethod] };
  const recurringContract = getSelectedRecurringContract(paymentState);
  const method = recurringContract
    ? `${recurringContract.variant}-recurring`
    : paymentState.selectedPaymentMethod;

  Analytics.track(eventName, {
    ...(bank.bank !== '0' ? bank : {}),
    method,
  });

  TopUpActions.setRecurringRequestContract(enabled, true);
}

class TopUpOptionsContainer extends React.Component {
  _onSubmitOptions(paymentState, topupState, user) {
    const paymentMethod = paymentState.paymentMethods.find(
      method => method.code === paymentState.selectedPaymentMethod,
    );

    if (paymentMethod && paymentMethod.code === 'creditcard') {
      PaymentActions.validateCreditcardDetails(paymentState, topupState);
      return;
    }

    PaymentActions.fetchPaymentURL(paymentState, topupState, user);
  }

  _renderTopUpOptions({ paymentState, authState, topUpState }) {
    return (
      <TopUpOptions
        paymentMethods={paymentState.paymentMethods}
        amounts={topUpState.amounts}
        onAmountChange={TopUpActions.setAmount}
        onBankChange={selectedBank =>
          PaymentActions.setPaymentMethod(
            paymentState.selectedPaymentMethod,
            selectedBank,
            paymentState.paymentMethods,
          )}
        onPaymentMethodChange={paymentCode =>
          PaymentActions.setPaymentMethod(
            paymentCode,
            paymentState.selectedBanks[paymentCode],
            paymentState.paymentMethods,
          )}
        onSetRecurringContract={() => toggleRecurring(!topUpState.recurringRequest, paymentState)}
        onSubmitOptions={() => this._onSubmitOptions(paymentState, topUpState, authState.user)}
        validCreditcard={creditcardFormValid(paymentState)}
        paymentURLLoading={paymentState.paymentURLStatus === STATUS_PENDING}
        recurring={!!topUpState.recurringRequest}
        recurringContracts={paymentState.recurring_contracts}
        selectedAmount={topUpState.selectedAmount}
        selectedPaymentMethod={paymentState.selectedPaymentMethod}
        transactionFees={topUpState.transactionFees}
        selectedBank={paymentState.selectedBanks[paymentState.selectedPaymentMethod]}
      />
    );
  }

  render() {
    return (
      <AltContainer
        stores={{ paymentState: PaymentStore, authState: AuthStore, topUpState: TopUpStore }}
        render={this._renderTopUpOptions.bind(this)}
      />
    );
  }
}

export default TopUpOptionsContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/containers/TopUpOptionsContainer.js