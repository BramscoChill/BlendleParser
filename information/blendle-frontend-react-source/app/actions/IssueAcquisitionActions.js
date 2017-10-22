import alt from 'instances/altInstance';
import * as AcquisitionManager from 'managers/acquisition';
import Analytics from 'instances/analytics';
import { history } from 'byebye';
import PaymentActions from 'actions/PaymentActions';

function getPercentagePurchased(acquisition) {
  const realPercentage = acquisition.price / acquisition.original_price;
  return Math.round(realPercentage * 100) / 100;
}

export default alt.createActions({
  fetchIssueAcquistion(issueId) {
    AcquisitionManager.fetchAcquisition(issueId).then(acquisition =>
      this.fetchIssueAcquistionSuccess({ issueId, acquisition }),
    );

    return null;
  },

  fetchIssueAcquistionSuccess({ issueId, acquisition }) {
    return { issueId, acquisition };
  },

  acquireIssue(issueId, providerId, analyticsType, legacyIssueAcquisition) {
    AcquisitionManager.acquireIssue(issueId, legacyIssueAcquisition)
      .then(acquisition =>
        this.acquireIssueSuccess({ issueId, acquisition, providerId, analyticsType }),
      )
      .catch((error) => {
        this.acquireIssueError(issueId, error);
        if (error.status !== 402) {
          throw error;
        }
      });

    return issueId;
  },

  acquireIssueSuccess({ issueId, acquisition, providerId, analyticsType }) {
    Analytics.track('Acquire Full Issue', {
      type: analyticsType,
      provider: providerId,
      percentage_purchased: getPercentagePurchased(acquisition),
      issue_price: acquisition.original_price,
      issue_id: issueId,
    });

    history.navigate(`/issue-acquired/${issueId}`, { trigger: true });

    return issueId;
  },

  acquireIssueError(issueId, error) {
    if (error.status === 402) {
      PaymentActions.setReturnUrl(window.location.pathname);
      history.navigate('/payment', { trigger: true });
    }

    return issueId;
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/IssueAcquisitionActions.js