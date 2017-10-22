import alt from 'instances/altInstance';
import IssueAcquisitionActions from 'actions/IssueAcquisitionActions';

class IssueAcquisitionStore {
  constructor() {
    this.bindActions(IssueAcquisitionActions);

    this.state = {
      issueAcquisitions: {}, // key(id) value(acquisition)
    };
  }

  fetchIssueAcquistionSuccess({ issueId, acquisition }) {
    const { issueAcquisitions } = this.state;
    issueAcquisitions[issueId] = acquisition;

    this.setState({ issueAcquisitions });
  }
}

export default alt.createStore(IssueAcquisitionStore, 'IssueAcquisitionStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/IssueAcquisitionStore.js