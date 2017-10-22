import Auth from 'controllers/auth';
import { Model } from 'byebye';
import Settings from 'controllers/settings';
import IssueAcquisition from './issueacquisition';

const Acquisition = Model.extend({
  name: 'acquisition',
  autoRefundTimeout: 10, // In seconds
  mappings: {
    'b:issue-acquisition': { resource: IssueAcquisition },
  },
  parse(resp) {
    if (!resp._links) {
      resp._links = {};
    }

    if (!resp._links['b:issue-acquisition']) {
      resp._links['b:issue-acquisition'] = {
        href: Settings.getLink('issue_acquisition', {
          issue_id: resp._embedded.manifest.issue.id,
          user_context: Auth.getId(),
        }),
      };
    }

    return this.parseHal(resp);
  },
});

export default Acquisition;



// WEBPACK FOOTER //
// ./src/js/app/models/acquisition.js