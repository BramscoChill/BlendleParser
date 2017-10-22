import { compose, onlyUpdateForPropTypes, setPropTypes, lifecycle } from 'recompose';
import withRouter from 'react-router/lib/withRouter';
import altConnect from 'higher-order-components/altConnect';
import { shape, string } from 'prop-types';
import { STATUS_OK } from 'app-constants';
import DeepDiveActions from 'actions/DeepDiveActions';
import DeepDiveStore from 'stores/DeepDiveStore';
import DeepDive from '../components/DeepDive';

function mapStateToProps({ deepDiveState }, { params: { deepDiveId } }) {
  const details = deepDiveState.details.get(deepDiveId);
  const deepDive = details ? details.deepDive : null;
  const isLoading = !details || details.status !== STATUS_OK;

  return {
    isLoading,
    deepDive,
  };
}

mapStateToProps.stores = { DeepDiveStore };

const enhance = compose(
  withRouter,
  onlyUpdateForPropTypes,
  setPropTypes({
    params: shape({
      deepDiveId: string,
    }),
  }),
  lifecycle({
    componentDidMount() {
      const { deepDiveId } = this.props.params;

      DeepDiveActions.fetchDeepDive.defer(deepDiveId);
    },
  }),
  altConnect(mapStateToProps),
);

export default enhance(DeepDive);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/containers/DeepDiveContainer.js