import { compose, lifecycle } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import { STATUS_OK } from 'app-constants';
import DeepDiveActions from 'actions/DeepDiveActions';
import DeepDiveStore from 'stores/DeepDiveStore';
import DeepDives from '../components/DeepDives';

function mapStateToProps({ deepDiveState }) {
  const { overview } = deepDiveState;
  const isLoading = overview.status !== STATUS_OK;

  return {
    deepDives: overview.deepDives || null,
    isLoading,
  };
}

mapStateToProps.stores = { DeepDiveStore };

const enhance = compose(
  lifecycle({
    componentDidMount() {
      DeepDiveActions.fetchOverview.defer();
    },
  }),
  altConnect(mapStateToProps),
);

export default enhance(DeepDives);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/containers/DeepDivesContainer.js