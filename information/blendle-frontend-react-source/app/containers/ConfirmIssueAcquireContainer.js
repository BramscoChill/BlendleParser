import React from 'react';
import PropTypes from 'prop-types';
import ConfirmIssueAcquireDialog from 'components/dialogues/ConfirmIssueAcquireDialog';
import { providerById, prefillSelector } from 'selectors/providers';
import moment from 'moment';

class ConfirmIssueAcquireContainer extends React.Component {
  static propTypes = {
    onCancel: ConfirmIssueAcquireDialog.propTypes.onCancel,
    onConfirm: ConfirmIssueAcquireDialog.propTypes.onConfirm,
    issue: PropTypes.object.isRequired,
  };

  render() {
    const { issue, onCancel, onConfirm } = this.props;
    const providerName = prefillSelector(providerById)(issue.get('provider').id).name;
    const dateString = moment(issue.get('date'))
      .calendar()
      .toLowerCase();
    const issueAcquisition = issue.getEmbedded('b:issue-acquisition');

    return (
      <ConfirmIssueAcquireDialog
        onConfirm={onConfirm}
        onCancel={onCancel}
        providerName={providerName}
        dateString={dateString}
        coverUrl={issue.getCoverURL()}
        price={issueAcquisition.get('price')}
      />
    );
  }
}

export default ConfirmIssueAcquireContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/ConfirmIssueAcquireContainer.js