import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import PaymentHeader from 'components/dialogues/Header';
import { translate } from 'instances/i18n';
import Confetti from 'components/Confetti';
import classNames from 'classnames';

class PaymentResultDialogue extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    condition: PropTypes.oneOf(['success', 'cancelled', 'pending']),
  };

  _renderSuccess = () => (
    <div>
      <h2 className="lead">{translate('payment.result.success.title')}</h2>
      <Confetti className="confetti" />
      <div className="fade" />
      <p className="text">{translate('payment.result.success.text')}</p>
    </div>
  );

  _renderCancelled = () => (
    <div>
      <h2 className="lead">{translate('payment.result.cancelled.title')}</h2>
    </div>
  );

  _renderPending = () => (
    <div>
      <h2 className="lead">{translate('payment.result.pending.title')}</h2>
      <p className="text">{translate('payment.result.pending.text')}</p>
    </div>
  );

  _renderBody = () => {
    if (this.props.condition === 'pending') {
      return this._renderPending();
    }

    if (this.props.condition === 'cancelled') {
      return this._renderCancelled();
    }

    if (this.props.condition === 'success') {
      return this._renderSuccess();
    }

    return null;
  };

  render() {
    const classes = classNames('dialog-payment-result', `dialog-payment-${this.props.condition}`);

    return (
      <Dialogue className={classes} onClose={this.props.onClose}>
        <PaymentHeader user={this.props.user} />
        <div className="body">
          {this._renderBody()}
          <button className="btn btn-go" onClick={this.props.onClose}>
            {translate('app.buttons.ok')}
          </button>
        </div>
      </Dialogue>
    );
  }
}

export default PaymentResultDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/PaymentResult.js