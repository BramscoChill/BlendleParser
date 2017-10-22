import React from 'react';
import altConnect from 'higher-order-components/altConnect';
import TilesStore from 'stores/TilesStore';
import ItemStore from 'stores/ItemStore';
import SharedByOthers from '../components/SharedByOthers';

const MaybeSharedByOthers = ({ isHidden, ...props }) => !isHidden && <SharedByOthers {...props} />;

function mapStateToProps({ tilesState, itemState }) {
  const { selectedItemId } = itemState;
  const tile = tilesState.tiles.get(selectedItemId);

  if (!tile) {
    return null;
  }

  const totalPostCount = tile['user-post']
    ? tile.post_count - 1 // Do not include a user's own post
    : tile.post_count;

  return {
    isHidden: totalPostCount < 1,
    totalPostCount,
    followedUserPosts: tile['followed-user-posts'],
  };
}
mapStateToProps.stores = { TilesStore, ItemStore };

export default altConnect(mapStateToProps)(MaybeSharedByOthers);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/SharedByOthersContainer.js