import { compose, setDisplayName } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import LabActions from 'actions/LabActions';
import LabStore from 'stores/LabStore';
import AuthStore from 'stores/AuthStore';
import LabPage from '../components/LabPage';

const actions = {
  onToggle: (experiment, toggle) => {
    LabActions.toggleExperiment(AuthStore.getState().user, experiment, toggle);
  },
};

function mapStateToProps({ labState }) {
  const { experiments, loadingExperiments } = labState;

  return {
    experiments,
    loadingExperiments,
  };
}

mapStateToProps.stores = { LabStore };

const enhance = compose(setDisplayName('LabContainer'), altConnect(mapStateToProps, actions));

export default enhance(LabPage);



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/LabContainer.js