import axios from 'axios';
import Settings from 'controllers/settings';
import Auth from 'controllers/auth';

const CONFIG = {
  headers: {
    accept: 'application/hal+json',
  },
};

export function fetchAcquisition(issueId) {
  const link = Settings.getLink('issue_acquisition', { issue_id: issueId });

  return axios.get(link, CONFIG).then(resp => resp.data);
}

/**
 * Acquire an issue
 * @param  {string} issueId
 * @param  {Object} legacyIssueAcquisition Legacy Backbone Model
 * @return {Promise}
 */
export function acquireIssue(issueId, legacyIssueAcquisition) {
  return axios
    .post(
      Settings.getLink('user_issues', { user_id: Auth.getId() }),
    {
      id: issueId,
    },
      CONFIG,
    )
    .then((resp) => {
      const issueAcquisition = resp.data;

      Auth.getUser().subtractFromBalance(issueAcquisition.price);

      if (legacyIssueAcquisition) {
        legacyIssueAcquisition.set(issueAcquisition, { parse: true });
      }
      return issueAcquisition;
    });
}



// WEBPACK FOOTER //
// ./src/js/app/managers/acquisition.js