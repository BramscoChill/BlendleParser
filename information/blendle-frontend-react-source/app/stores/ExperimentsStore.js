import { STATUS_INITIAL, STATUS_OK } from 'app-constants';
import alt from 'instances/altInstance';
import ExperimentsActions from 'actions/ExperimentsActions';

class ExperimentsStore {
  status = STATUS_INITIAL;
  experiments = [];

  constructor() {
    this.bindActions(ExperimentsActions);
  }

  onSyncExperiments(experiments) {
    this.setState({
      status: STATUS_OK,
      experiments,
    });
  }

  onSyncExperiment(experiment) {
    this.setState({
      experiments: this.experiments.concat(experiment),
    });
  }
}

export default alt.createStore(ExperimentsStore, 'ExperimentsStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ExperimentsStore.js