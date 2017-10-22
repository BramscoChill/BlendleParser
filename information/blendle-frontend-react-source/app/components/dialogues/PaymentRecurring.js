import React from 'react';
import PropTypes from 'prop-types';
import { translate, getCurrencyWord } from 'instances/i18n';
import Dialogue from 'components/dialogues/Dialogue';
import PaymentHeader from 'components/dialogues/Header';

class PaymentRecurringDialogue extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Dialogue className="dialogue-payment-recurring" onClose={this.props.onClose}>
        <PaymentHeader user={this.props.user} />
        <div className="body">
          <h1 className="dialogue-payment-recurring-title">
            {translate('payment.recurring.hotlink.title')}
          </h1>
          <div
            className="text"
            dangerouslySetInnerHTML={{
              __html: translate('payment.recurring.hotlink.body', {
                currency: getCurrencyWord(),
              }),
            }}
          />
          <button className="btn btn-dismiss" onClick={this.props.onClose}>
            {translate('app.buttons.i_get_it')}
          </button>
        </div>
      </Dialogue>
    );
  }
}

export default PaymentRecurringDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/PaymentRecurring.js