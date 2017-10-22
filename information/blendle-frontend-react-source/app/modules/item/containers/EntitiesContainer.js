import { compose } from 'recompose';
import { LAB_EXPERIMENTS } from 'app-constants';
import altConnect from 'higher-order-components/altConnect';
import ensureLabExperiment from 'higher-order-components/ensureLabExperiment';
import ItemStore from 'stores/ItemStore';
import Entities from '../components/Entities';

function mapStateToProps({ itemState }) {
  const { entities } = itemState;

  return { entities };
}

mapStateToProps.stores = {
  ItemStore,
};

export default compose(
  ensureLabExperiment(LAB_EXPERIMENTS.ENTITIES_IN_THE_READER),
  altConnect(mapStateToProps),
)(Entities);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/EntitiesContainer.js