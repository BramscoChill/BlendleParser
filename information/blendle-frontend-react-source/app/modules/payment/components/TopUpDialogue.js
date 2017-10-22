import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import TopUpOptionsContainer from 'modules/payment/containers/TopUpOptionsContainer';
import TopUpConfirmationContainer from 'modules/payment/containers/TopUpConfirmationContainer';
import PaymentHeader from 'components/dialogues/Header';
import PaymentFooter from 'modules/payment/components/PaymentFooter';
import classNames from 'classnames';

class TopUpDialogue extends React.Component {
  static propTypes = {
    activeStep: PropTypes.oneOf(['options', 'confirmation']),
    onBack: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  _renderContent() {
    if (this.props.loading) {
      return null;
    }

    if (this.props.activeStep === 'confirmation') {
      return <TopUpConfirmationContainer />;
    }

    return <TopUpOptionsContainer />;
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
    );

    return (
      <Dialogue
        hideClose
        allowClose={false}
        onClose={this.props.onClose}
        className={dialogueClasses}
      >
        {this._renderCloseButton()}
        <PaymentHeader user={this.props.user} />
        <div className="dialogue-payment-body">{this._renderContent()}</div>
        <PaymentFooter />
      </Dialogue>
    );
  }
}

export default TopUpDialogue;



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/components/TopUpDialogue.js