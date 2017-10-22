import React, { PureComponent } from 'react';
import AltContainer from 'alt-container';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import ItemStore from 'stores/ItemStore';
import Share from '../components/Share';

class ShareContainer extends PureComponent {
  _renderShare = ({ tilesState, authState }) => {
    const { tiles } = tilesState;
    const { selectedItemId } = ItemStore.getState();
    const tile = tiles.get(selectedItemId);

    if (authState.user.isModerator() || !tile) {
      return null;
    }

    return <Share />;
  };

  render() {
    return (
      <AltContainer
        stores={{
          itemState: ItemStore,
          tilesState: TilesStore,
          authState: AuthStore,
        }}
        render={this._renderShare}
      />
    );
  }
}

export default ShareContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ShareContainer.js