import alt from 'instances/altInstance';
import LabActions from 'actions/LabActions';
import { without } from 'lodash';

class LabStore {
  experiments = [];
  loadingExperiments = [];
  error = null;

  constructor() {
    this.bindActions(LabActions);
  }

  onLoadExperiments(experiments) {
    this.setState({
      experiments,
    });
  }

  onToggleExperiment({ experiment }) {
    this.setState({
      loadingExperiments: [...this.loadingExperiments, experiment.key],
    });
  }

  onToggleExperimentSuccess({ experiment, toggle }) {
    const experiments = this.experiments.map((currentExperiment) => {
      if (currentExperiment.key === experiment.key) {
        return {
          ...currentExperiment,
          enabled: toggle,
        };
      }

      return currentExperiment;
    });

    this.setState({
      experiments,
      loadingExperiments: without(experiment.key, this.loadingExperiments),
    });
  }

  onToggleExperimentError({ experiment, error }) {
    this.setState({
      error,
      loadingExperiments: without(experiment.key, this.loadingExperiments),
    });
  }
}

export default alt.createStore(LabStore, 'LabStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/LabStore.js