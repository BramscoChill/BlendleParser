import React from 'react';
import PropTypes from 'prop-types';
import IssueModel from 'models/issue';
import Settings from 'controllers/settings';
import AuthStore from 'stores/AuthStore';
import Analytics from 'instances/analytics';
import PagesIssueContainer from 'modules/issue/containers/PagesIssueContainer';
import TilesIssueContainer from 'modules/issue/containers/TilesIssueContainer';

function issueUrl(issueId, userId, providerId) {
  if (issueId) {
    return Settings.getLink('issue', { issue_id: issueId, user_context: userId });
  }

  return Settings.getLink('latest_issue', { provider_id: providerId });
}

class IssueContainer extends React.Component {
  static propTypes = {
    issueId: PropTypes.string,
    providerId: PropTypes.string.isRequired,
    section: PropTypes.string,
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      issue: null,
      currentSection: null,
      navigateToSectionIndex: 0,
    };
  }

  componentDidMount() {
    const user = AuthStore.getState().user;

    const url = issueUrl(this.props.issueId, user.id, this.props.providerId);
    const issue = new IssueModel(null, { url });

    issue
      .fetch()
      .then(() => {
        const itemRelationType = issue.getLink('items') ? 'items' : 'pages';

        this.setState(
          {
            issue,
            itemRelationType,
          },
          () => {
            Analytics.track('View Issue', {
              issue_id: issue.id,
              provider_id: issue.get('provider').id,
            });
          },
        );
      })
      .catch((error) => {
        if (error.status === 404) {
          this.props.router.replace('/404');
          return;
        }

        throw error;
      });
  }

  _renderIssueContainer() {
    if (!this.state.issue) {
      return null;
    }

    if (this.state.itemRelationType === 'pages') {
      return <PagesIssueContainer issue={this.state.issue} section={this.props.section} />;
    }

    return <TilesIssueContainer issue={this.state.issue} />;
  }

  render() {
    return this._renderIssueContainer();
  }
}

export default IssueContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/containers/IssueContainer.js