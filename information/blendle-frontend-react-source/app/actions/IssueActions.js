import alt from 'instances/altInstance';
import Issue from 'models/issue';
import Settings from 'controllers/settings';
import Auth from 'controllers/auth';

export default alt.createActions({
  /**
   * change active/visible state of the issue pane
   * used to lock the scrolling of the TilePane
   * @param {Boolean} visible
   */
  changeVisibility(visible) {
    return visible;
  },

  fetchLatestIssue(providerId, currentState) {
    if (currentState && currentState.latestIssues[providerId]) {
      return this.fetchLatestIssueSuccess({
        [providerId]: currentState.latestIssues[providerId],
      });
    }

    const url = Settings.getLink('latest_issue', { provider_id: providerId });

    const issue = new Issue(null, { url });
    issue.fetch().then(() => {
      this.fetchLatestIssueSuccess({
        [providerId]: issue,
      });
    });

    return null;
  },

  fetchIssue(issueId) {
    const url = Settings.getLink('issue', { issue_id: issueId, user_context: Auth.getId() });
    const issue = new Issue(null, { url, track: true });
    issue.fetch().then(() => this.fetchIssueSuccess({ [issueId]: issue }));

    return issueId;
  },

  fetchLatestIssueSuccess: x => x,

  fetchIssueSuccess: x => x,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/IssueActions.js