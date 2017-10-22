import React from 'react';
import AltContainer from 'alt-container';
import TopUpConfirmation from 'modules/payment/components/TopUpConfirmation';
import PaymentStore from 'stores/PaymentStore';
import TopUpActions from 'actions/TopUpActions';
import TopUpStore from 'stores/TopUpStore';
import AuthStore from 'stores/AuthStore';
import { eligibleFirstDepositGift, eligiblePayPalDepositGift } from 'helpers/gifts';
import { STATUS_PENDING } from 'app-constants';

class TopUpConfirmationContainer extends React.Component {
  _renderTopUpConfirmation({ paymentState, authState, topUpState }) {
    return (
      <TopUpConfirmation
        recurringContract={paymentState.recurring_contracts.find(
          contract => contract.id === paymentState.selectedPaymentMethod,
        )}
        firstDepositGift={eligibleFirstDepositGift(
          paymentState.paymentMethods,
          topUpState.selectedAmount,
        )}
        onSubmitConfirmation={(recurringContract) => {
          TopUpActions.topUp(
            topUpState.selectedAmount,
            recurringContract,
            topUpState.recurringRequest,
            authState.user,
          );
        }}
        onSubmitCreditcard={() => {
          TopUpActions.topupCreditcard(
            topUpState.selectedAmount,
            paymentState.creditcardDetails,
            topUpState.recurringRequest,
            authState.user,
          );
        }}
        paymentMethods={paymentState.paymentMethods}
        paymentURL={paymentState.paymentURL}
        paypalDepositGift={eligiblePayPalDepositGift(
          paymentState.paymentMethods,
          topUpState.selectedAmount,
          paymentState.selectedPaymentMethod,
        )}
        selectedAmount={topUpState.selectedAmount}
        selectedPaymentMethod={paymentState.selectedPaymentMethod}
        topUpLoading={topUpState.topUpStatus === STATUS_PENDING}
        transactionFees={topUpState.transactionFees}
        selectedBank={paymentState.selectedBanks[paymentState.selectedPaymentMethod]}
      />
    );
  }

  render() {
    return (
      <AltContainer
        render={this._renderTopUpConfirmation.bind(this)}
        stores={{ paymentState: PaymentStore, authState: AuthStore, topUpState: TopUpStore }}
      />
    );
  }
}

export default TopUpConfirmationContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/containers/TopUpConfirmationContainer.js