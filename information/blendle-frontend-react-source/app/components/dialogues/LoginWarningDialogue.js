import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogBody } from '@blendle/lego';
import { translate } from 'instances/i18n';
import Link from 'components/Link';

export default class LoginWarningDialogue extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  };

  render() {
    return (
      <Dialog onClose={this.props.onClose}>
        <DialogBody>
          <h2>{translate('login.settings_warning_header')}</h2>
          <p>{translate('login.settings_warning')}</p>
          <Link href="/signup/login" onClick={this.props.onClose} className="btn btn-fullwidth">
            {translate('app.buttons.login')}
          </Link>
        </DialogBody>
      </Dialog>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/LoginWarningDialogue.js