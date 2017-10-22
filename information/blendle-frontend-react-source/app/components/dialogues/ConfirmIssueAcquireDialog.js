import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import { translateElement, formatCurrency } from 'instances/i18n';
import IssueStack from 'containers/IssueStackContainer';

class ConfirmIssueAcquireDialog extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    providerName: PropTypes.string.isRequired,
    dateString: PropTypes.string.isRequired,
    coverUrl: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  };

  render() {
    const { onConfirm, onCancel, providerName, dateString, coverUrl, price } = this.props;

    return (
      <Dialogue className="v-acquire-issue" onClose={onCancel}>
        <IssueStack className="issue-stack" src={coverUrl} />
        {translateElement(<h2 />, 'item.dialogs.acquire.title_not_acquired', [
          providerName,
          dateString,
        ])}
        {translateElement(
          <div className="btn btn-green btn-fullwidth" onClick={onConfirm} />,
          'item.dialogs.acquire.btn_not_acquired',
          [formatCurrency(price)],
        )}
      </Dialogue>
    );
  }
}

export default ConfirmIssueAcquireDialog;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/ConfirmIssueAcquireDialog.js