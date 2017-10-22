import React from 'react';
import PropTypes from 'prop-types';
import { history } from 'byebye';
import IssueAcquiredDialog from 'components/dialogues/IssueAcquiredDialog';
import IssueStore from 'stores/IssuesStore';
import IssueActions from 'actions/IssueActions';
import AltContainer from 'alt-container';
import { providerById, prefillSelector } from 'selectors/providers';
import moment from 'moment';

function getIssueUrl(issue) {
  return `/issue/${issue.get('provider').id}/${issue.get('id')}`;
}

class IssueAcquiredContainer extends React.Component {
  static propTypes = {
    issueId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { issueId } = this.props;
    IssueActions.fetchIssue(issueId);
  }

  _onClickBrowse = (issue) => {
    this.props.onClose();
    history.navigate(getIssueUrl(issue), { trigger: true, replace: true });
  };

  _renderDialog = (issue) => {
    const providerName = prefillSelector(providerById)(issue.get('provider').id).name;
    const dateString = moment(issue.get('date'))
      .calendar()
      .toLowerCase();

    return (
      <IssueAcquiredDialog
        onClickClose={this.props.onClose}
        onClickBrowse={this._onClickBrowse.bind(this, issue)}
        providerName={providerName}
        dateString={dateString}
        coverUrl={issue.getCoverURL()}
      />
    );
  };

  render() {
    const { issueId } = this.props;

    return (
      <AltContainer
        store={IssueStore}
        render={(prop) => {
          const issue = prop.issues[issueId];

          if (issue) {
            return this._renderDialog(issue);
          }

          return null;
        }}
      />
    );
  }
}

export default IssueAcquiredContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/IssueAcquiredContainer.js