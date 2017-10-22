import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import classNames from 'classnames';
import PaymentFooter from 'modules/payment/components/PaymentFooter';
import SubscriptionOptionsContainer from 'modules/payment/containers/SubscriptionOptionsContainer';
import SubscriptionConfirmationContainer from 'modules/payment/containers/SubscriptionConfirmationContainer';
import { STATUS_ERROR, STATUS_INITIAL, STATUS_PENDING, STATUS_OK } from 'app-constants';

class SubscriptionDialogue extends React.Component {
  static propTypes = {
    onBack: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    activeStep: PropTypes.string.isRequired,
  };

  _renderContent() {
    if (this.props.loading) {
      return null;
    }

    if (this.props.activeStep === 'confirmation') {
      return <SubscriptionConfirmationContainer />;
    }

    return <SubscriptionOptionsContainer />;
  }

  _renderCloseButton() {
    if (this.props.activeStep === 'confirmation') {
      return <button className="btn btn-back" aria-label="Back" onClick={this.props.onBack} />;
    }

    return <button className="btn btn-close" aria-label="Close" onClick={this.props.onClose} />;
  }

  render() {
    const dialogueClasses = classNames(
      'dialogue-payment',
      `dialogue-payment-${this.props.activeStep}`,
      'dialog-payment-subscription',
    );

    return (
      <Dialogue hideClose onClose={this.props.onClose} className={dialogueClasses}>
        {this._renderCloseButton()}
        <div className="dialogue-payment-body">{this._renderContent()}</div>
        <PaymentFooter />
      </Dialogue>
    );
  }
}

export default SubscriptionDialogue;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/SubscriptionDialogue.js