import { compose } from 'recompose';
import { get } from 'lodash';
import LabStore from 'stores/LabStore';
import renderNothingIfIsHidden from './renderNothingIfIsHidden';
import altConnect from './altConnect';

export default function ensureLabExperiment(experimentName) {
  function mapStateToProps({ labState }) {
    const experiments = get(labState, 'experiments', []);
    const experiment = experiments.find(({ key }) => key === experimentName);
    const isHidden = !get(experiment, 'enabled', false);
    return { isHidden };
  }

  mapStateToProps.stores = { LabStore };

  return compose(altConnect(mapStateToProps), renderNothingIfIsHidden);
}



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/ensureLabExperiment.js