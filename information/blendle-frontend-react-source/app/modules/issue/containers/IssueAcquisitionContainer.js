import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IssueAcquisition from 'modules/issue/components/IssueAcquisition';
import IssueAcquisitionActions from 'actions/IssueAcquisitionActions';
import { providerById, prefillSelector } from 'selectors/providers';
import makeCancelable from 'helpers/makeCancelable';
import BrowserEnvironment from 'instances/browser_environment';
import DialogueController from 'controllers/dialogues';
import ConfirmIssueAcquireContainer from 'containers/ConfirmIssueAcquireContainer';
import Auth from 'controllers/auth';

class IssueAcquisitionContainer extends Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      issueAcquisition: null,
      confirm: false,
      showTooltip:
        !BrowserEnvironment.isMobile() &&
        !Auth.getUser().get('preferences').hide_acquire_issue_tooltip,
    };
  }

  componentDidMount() {
    this._cancelablePromise = makeCancelable(this.props.issue.getRelation('b:issue-acquisition'));

    this._cancelablePromise.promise
      .then(() => this.props.issue.getEmbedded('b:issue-acquisition'))
      .then((issueAcquisition) => {
        this.setState({ issueAcquisition });
        issueAcquisition.on('change', this._onIssueAcquistionChange);
      })
      .catch((error) => {
        if (!error.isCanceled) {
          throw error;
        }
      });
  }

  componentWillUnmount() {
    if (this.state.issueAcquisition) {
      this.state.issueAcquisition.off('change', this._onIssueAcquistionChange);
    }

    this._cancelablePromise.cancel();
  }

  _onIssueAcquistionChange = () => {
    this.setState({ issueAcquisition: this.state.issueAcquisition });
  };

  _onShowConfirm = () => {
    if (BrowserEnvironment.isMobile()) {
      const onClose = DialogueController.openComponent(
        <ConfirmIssueAcquireContainer
          issue={this.props.issue}
          onCancel={() => onClose()}
          onConfirm={() => {
            onClose();
            const issueId = this.props.issue.id;
            const providerId = this.props.issue.get('provider').id;
            const legacyIssueAcquisition = this.props.issue.getEmbedded('b:issue-acquisition');
            IssueAcquisitionActions.acquireIssue(
              issueId,
              providerId,
              'kiosk',
              legacyIssueAcquisition,
            );
          }}
        />,
      );
    }
  };

  _onClick = () => {
    if (BrowserEnvironment.isMobile()) {
      this._onShowConfirm();
      return;
    }

    if (!this.state.confirm) {
      this.setState({ confirm: true });
    } else {
      const issueId = this.props.issue.id;
      const providerId = this.props.issue.get('provider').id;
      const legacyIssueAcquisition = this.props.issue.getEmbedded('b:issue-acquisition');
      IssueAcquisitionActions.acquireIssue(issueId, providerId, 'kiosk', legacyIssueAcquisition);
    }
  };

  _onCloseTooltip = () => {
    Auth.getUser().savePreferences({
      hide_acquire_issue_tooltip: '1',
    });

    this.setState({ showTooltip: false });
  };

  render() {
    const { issueAcquisition } = this.state;
    const { issue } = this.props;

    if (
      !issueAcquisition ||
      issueAcquisition.get('subscription') ||
      !issueAcquisition.isEligibleForAcquisition()
    ) {
      return null;
    }

    const providerName = prefillSelector(providerById)(issue.get('provider').id).name;

    return (
      <IssueAcquisition
        originalPrice={issueAcquisition.get('original_price')}
        price={issueAcquisition.get('price')}
        providerName={providerName}
        percentage={issueAcquisition.getPercentagePurchased()}
        confirm={this.state.confirm}
        onClick={this._onClick}
        acquired={issueAcquisition.get('acquired')}
        hideButton={BrowserEnvironment.isMobile()}
        showTooltip={this.state.showTooltip}
        onCloseTooltip={this._onCloseTooltip}
      />
    );
  }
}

export default IssueAcquisitionContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/containers/IssueAcquisitionContainer.js