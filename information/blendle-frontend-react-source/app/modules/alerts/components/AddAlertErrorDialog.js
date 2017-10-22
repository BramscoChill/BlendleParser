import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/dialogues/Dialogue';
import { translateElement } from 'instances/i18n';

export default class AddAlertErrorDialog extends React.Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired,
  };

  _renderMessage() {
    switch (this.props.error.status) {
      case 422:
        return translateElement(<p />, 'alerts.errors.double', [this.props.query], false);
      case 409:
        return translateElement(<p />, 'alerts.errors.limit');
      default:
        return translateElement(<p />, 'alerts.errors.failed_adding_alert');
    }
  }

  render() {
    return (
      <Dialog>
        {translateElement(<h2 />, 'app.error.title')}
        {this._renderMessage()}
      </Dialog>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/components/AddAlertErrorDialog.js