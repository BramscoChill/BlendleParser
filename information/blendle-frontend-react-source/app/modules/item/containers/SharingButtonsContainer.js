import React, { PureComponent } from 'react';
import { memoize } from 'lodash';
import AltContainer from 'alt-container';
import ShareActions from 'actions/ShareActions';
import AuthStore from 'stores/AuthStore';
import ShareStore from 'stores/ShareStore';
import ItemStore from 'stores/ItemStore';
import TileStore from 'stores/TilesStore';
import { getManifest } from 'selectors/tiles';
import NewSharingButtons from '../components/NewSharingButtons';

const getAnalytics = memoize(itemId => ({
  item_id: itemId,
  location_in_layout: 'recommend-or-share',
}));

class SharingButtonsContainer extends PureComponent {
  _onSocialShare = (platform) => {
    const { user } = AuthStore.getState();
    const { tiles } = TileStore.getState();
    const { selectedItemId } = ItemStore.getState();
    const manifest = getManifest(tiles, selectedItemId);

    ShareActions.shareItemToPlatform(platform, manifest, getAnalytics(selectedItemId), user);
  };

  // eslint-disable-next-line react/prop-types
  _renderSharingButtons = ({ shareState, itemState }) => {
    const { selectedItemId } = itemState;

    return (
      <NewSharingButtons
        onSocialShare={this._onSocialShare}
        loadingPlatforms={shareState.loadingPlatforms}
        itemId={selectedItemId}
        analytics={getAnalytics(selectedItemId)}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          shareState: ShareStore,
          itemState: ItemStore,
        }}
        render={this._renderSharingButtons}
      />
    );
  }
}

export default SharingButtonsContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/SharingButtonsContainer.js