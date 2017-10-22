import { Component } from 'react';
import { string, number, bool } from 'prop-types';
import { compose, branch } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import redirect from 'higher-order-components/redirect';
import { isItemAcquired } from 'selectors/item';
import { replaceLastPath } from 'helpers/url';
import ItemActions from 'actions/ItemActions';
import ItemStore from 'stores/ItemStore';
import AuthStore from 'stores/AuthStore';
import { PARTNER_SHARERS } from 'app-constants';
import isDeeplink from '../helpers/isDeeplink';
import withItemErrorHandling from '../higher-order-components/withItemErrorHandling';

class AcquireItem extends Component {
  static propTypes = {
    itemId: string.isRequired,
    userId: string.isRequired,
    socialOrigin: string,
    runningAcquisitionXHRs: number.isRequired,
    isAcquired: bool,
  };

  componentDidMount() {
    const { itemId, userId, socialOrigin, runningAcquisitionXHRs, isAcquired } = this.props;

    // check runningAcquisitionXHRs <= 0
    if (runningAcquisitionXHRs < 1 && !isAcquired) {
      ItemActions.acquireItem.defer(itemId, userId, socialOrigin);
    }
  }

  render() {
    return null; // No need to render anything, this component only performs some actions
  }
}

function mapStateToProps({ itemState, authState }, { params, location }) {
  const { itemId } = params;
  const { sharer } = location.query;
  const { user: { id: userId } } = authState;
  const { runningAcquisitionXHRs } = itemState;

  const isAcquired = isItemAcquired(itemState);

  const redirectTo =
    isAcquired && location.pathname.endsWith('/acquire')
      ? `${replaceLastPath(location.pathname, '')}${location.search}`
      : '';

  const isDeeplinkWithSharer = sharer && isDeeplink(itemId);
  let socialOrigin = null;
  if (isDeeplinkWithSharer || PARTNER_SHARERS.includes(sharer)) {
    socialOrigin = sharer;
  }

  return { itemId, userId, socialOrigin, redirectTo, runningAcquisitionXHRs, isAcquired };
}
mapStateToProps.stores = { ItemStore, AuthStore };

export default compose(
  altConnect(mapStateToProps),
  branch(({ redirectTo }) => redirectTo, redirect({ replace: true })),
  withItemErrorHandling,
)(AcquireItem);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/AcquireItemContainer.js