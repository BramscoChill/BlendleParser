import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { translate, translateElement } from 'instances/i18n';
import Dialog from 'components/dialogues/Dialogue';

class ResendDialog extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    error: PropTypes.object,
  };

  _renderError() {
    return (
      <Dialog className="resend-mail">
        {translateElement(<p />, 'settings.emails.confirmation_send_failed', [], false)}
        <Button onClick={this.props.onClose}>{translate('app.buttons.ok')}</Button>
      </Dialog>
    );
  }

  render() {
    if (this.props.error) {
      return this._renderError();
    }

    return (
      <Dialog className="resend-mail" onClose={this.props.onClose}>
        <h2>{translate('settings.emails.confirmation_sent')}</h2>
        <p>{translate('settings.emails.confirmation_sent_to', [this.props.email])}</p>
        <Button onClick={this.props.onClose}>{translate('app.buttons.ok')}</Button>
      </Dialog>
    );
  }
}

export default ResendDialog;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ResendDialog.js