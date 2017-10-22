import { compose, branch, renderNothing } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import AuthStore from 'stores/AuthStore';
import DeleteAccount from '../components/DeleteAccount';

function mapStateToProps({ authState }) {
  const { user } = authState;

  const isHidden = user.attributes.orders !== 0 || !user.attributes.has_password;

  return {
    isHidden,
  };
}
mapStateToProps.stores = { AuthStore };

export default compose(
  altConnect(mapStateToProps),
  branch(({ isHidden }) => isHidden, renderNothing),
)(DeleteAccount);



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/DeleteAccountContainer.js