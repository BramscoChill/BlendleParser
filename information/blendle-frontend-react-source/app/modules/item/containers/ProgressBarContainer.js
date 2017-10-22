import altConnect from 'higher-order-components/altConnect';
import { STATUS_OK } from 'app-constants';
import ItemStore from 'stores/ItemStore';
import ProgressBar from '../components/ProgressBar';

const mapStateToProps = ({ itemState }) => ({
  progress: itemState.readingPercentage,
  hidden: itemState.status !== STATUS_OK,
});
mapStateToProps.stores = { ItemStore };

export default altConnect(mapStateToProps)(ProgressBar);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ProgressBarContainer.js