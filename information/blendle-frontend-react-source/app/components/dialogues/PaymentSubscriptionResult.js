import React from 'react';
import PropTypes from 'prop-types';
import { translate, translateElement } from 'instances/i18n';
import { STATUS_PENDING, STATUS_ERROR, STATUS_OK, STATUS_INITIAL } from 'app-constants';
import { providerById, prefillSelector } from 'selectors/providers';
import classNames from 'classnames';
import Dialogue from 'components/dialogues/Dialogue';
import PaymentHeader from 'components/dialogues/Header';
import Confetti from 'components/Confetti';

class PaymentSubscriptionResultDialogue extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    status: PropTypes.oneOf([STATUS_PENDING, STATUS_ERROR, STATUS_OK, STATUS_INITIAL]).isRequired,
    providerUid: PropTypes.string,
  };

  _renderBody = () => {
    if (this.props.status === STATUS_OK) {
      return (
        <div className="body">
          <h2 className="lead">{translate('app.text.congratulations')}</h2>
          <Confetti className="confetti" />
          <div className="fade" />
          {translateElement(<p className="text" />, 'payment.subscription.success_message', [
            prefillSelector(providerById)(this.props.providerUid).name,
          ])}
          <button className="btn btn-go" onClick={this.props.onClose}>
            {translate('payment.subscription.result_button')}
          </button>
        </div>
      );
    }
    return <div className="body" />;
  };

  render() {
    const classes = classNames('dialog-payment-result', 'dialog-payment-success', {
      'dialog-payment-loading': this.props.status === STATUS_PENDING,
    });

    return (
      <Dialogue className={classes} onClose={this.props.onClose}>
        {this._renderBody()}
      </Dialogue>
    );
  }
}

export default PaymentSubscriptionResultDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/PaymentSubscriptionResult.js