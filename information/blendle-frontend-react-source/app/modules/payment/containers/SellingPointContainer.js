import React from 'react';
import AltContainer from 'alt-container';
import PaymentStore from 'stores/PaymentStore';
import TopUpStore from 'stores/TopUpStore';
import AuthStore from 'stores/AuthStore';
import { get } from 'lodash';
import { eligibleFirstDepositGift, eligiblePayPalDepositGift } from 'helpers/gifts';
import SellingPoint from 'modules/payment/components/SellingPoint';

class SellingPointContainer extends React.Component {
  _renderSellingPoint({ paymentState, authState, topUpState }) {
    return (
      <SellingPoint
        firstDepositGift={eligibleFirstDepositGift(
          paymentState.paymentMethods,
          topUpState.selectedAmount,
        )}
        paypalDepositGift={eligiblePayPalDepositGift(
          paymentState.paymentMethods,
          topUpState.selectedAmount,
          paymentState.selectedPaymentMethod,
        )}
        user={authState.user}
        selectedAmount={topUpState.selectedAmount}
      />
    );
  }

  render() {
    return (
      <AltContainer
        stores={{ paymentState: PaymentStore, authState: AuthStore, topUpState: TopUpStore }}
        render={this._renderSellingPoint.bind(this)}
      />
    );
  }
}

export default SellingPointContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/containers/SellingPointContainer.js