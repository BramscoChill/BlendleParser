import altConnect from 'higher-order-components/altConnect';
import AuthStore from 'stores/AuthStore';
import { NavigationItemBadge } from '@blendle/lego';

function mapStateToProps({ authState: { user } }, ownProps) {
  const pins = user ? user.get('pins') : 0;

  return {
    ...ownProps,
    children: pins,
  };
}

mapStateToProps.stores = { AuthStore };

export default altConnect(mapStateToProps)(NavigationItemBadge);



// WEBPACK FOOTER //
// ./src/js/app/containers/navigation/PinsCountContainer.js