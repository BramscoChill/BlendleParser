import { withHandlers } from 'recompose';
import DeepDiveActions from 'actions/DeepDiveActions';
import Sharing from '../components/Sharing';

const enhance = withHandlers({
  onShare: ({ deepDive }) => platform => DeepDiveActions.shareDeepDive(deepDive, platform),
});

export default enhance(Sharing);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/containers/SharingContainer.js