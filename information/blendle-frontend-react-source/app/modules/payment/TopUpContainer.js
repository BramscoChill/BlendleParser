import React from 'react';
import PropTypes from 'prop-types';
import TopUpDialogue from 'modules/payment/components/TopUpDialogue';
import AltContainer from 'alt-container';
import PaymentStore from 'stores/PaymentStore';
import TopUpActions from 'actions/TopUpActions';
import TopUpStore from 'stores/TopUpStore';
import AuthStore from 'stores/AuthStore';
import { STATUS_PENDING } from 'app-constants';

class TopUpContainer extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  _onBack = () => {
    TopUpActions.setActiveStep('options');
  };

  _renderPayment = ({ paymentState, authState, topUpState }) => (
    <TopUpDialogue
      activeStep={topUpState.activeStep}
      onBack={this._onBack}
      onClose={this.props.onClose}
      user={authState.user}
      loading={paymentState.status === STATUS_PENDING}
    />
  );

  render() {
    return (
      <AltContainer
        stores={{ paymentState: PaymentStore, authState: AuthStore, topUpState: TopUpStore }}
        render={this._renderPayment}
      />
    );
  }
}

export default TopUpContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/TopUpContainer.js