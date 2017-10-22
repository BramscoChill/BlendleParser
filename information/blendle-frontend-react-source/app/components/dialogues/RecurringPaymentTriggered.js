import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import Button from 'components/Button';
import { translate } from 'instances/i18n';

export default class extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Dialogue className="recurring-triggered" onClose={this.props.onClose}>
        <h2>{translate('payment.recurring.triggered.title')}</h2>
        <p>{translate('payment.recurring.triggered.body')}</p>
        <Button className="btn-fullwidth" onClick={this.props.onClose}>
          {translate('app.buttons.i_get_it')}
        </Button>
      </Dialogue>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/RecurringPaymentTriggered.js