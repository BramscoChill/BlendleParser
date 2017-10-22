import React, { PureComponent } from 'react';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import { getTileManifest } from 'selectors/tiles';
import ItemStore from 'stores/ItemStore';
import Cookies from 'cookies-js';
import AltContainer from 'alt-container';
import PurchaseNotice from '../components/PurchaseNotice';
import withItemNotifications from '../higher-order-components/withItemNotifications';

class PurchaseNoticeContainer extends PureComponent {
  componentWillMount() {
    this._purchaseWarningCookie = Cookies.get('purchaseWarning');
  }

  // eslint-disable-next-line react/prop-types
  _renderPurchaseNotice = ({ itemState, authState, tilesState }) => {
    const { justAcquired, selectedItemId } = itemState;
    const { tiles } = tilesState;
    const tile = tiles.get(selectedItemId);
    const manifest = getTileManifest(tile);

    const { price } = tile;
    const { user } = authState;
    const hasProviderSubscription = user.hasActiveSubscription(manifest.provider.id);

    if (user.hasActivePremiumSubscription()) {
      return null; // ItemNotInBundleNotification is shown
    }

    if (justAcquired && user.get('reads') < 2 && !this._purchaseWarningCookie) {
      return null; // TODO: first purchase warning for non premium users
    }

    if (price && justAcquired && !hasProviderSubscription) {
      return <PurchaseNotice price={price / 100} />;
    }

    return null;
  };

  render() {
    return (
      <AltContainer
        stores={{
          itemState: ItemStore,
          tilesState: TilesStore,
          authState: AuthStore,
        }}
        render={this._renderPurchaseNotice}
      />
    );
  }
}

export default withItemNotifications(PurchaseNoticeContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/PurchaseNoticeContainer.js