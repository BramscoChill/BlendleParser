import React from 'react';
import { bool } from 'prop-types';
import altConnect from 'higher-order-components/altConnect';
import ShareActions from 'actions/ShareActions';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import RecommendButton from '../components/RecommendButton';
import RecommendButtonNew from '../components/RecommendButtonNew';

function onToggleShare(text) {
  const { user } = AuthStore.getState();
  const { tiles } = TilesStore.getState();
  const { selectedItemId } = ItemStore.getState();
  const tile = tiles.get(selectedItemId);

  if (tile['user-post']) {
    ShareActions.removeShareToFollowing(selectedItemId, user.id, text);
  } else {
    ShareActions.shareToFollowing(selectedItemId, user.id, text);
  }
}

function mapStateToProps({ itemState, tilesState, authState }) {
  const { tiles } = tilesState;
  const { selectedItemId } = itemState;
  const { user } = authState;
  const tile = tiles.get(selectedItemId);

  if (!tile) {
    return null;
  }

  return {
    active: !!tile['user-post'],
    postCount: tile.post_count,
    isModerator: user.isModerator(),
  };
}
mapStateToProps.stores = { ItemStore, TilesStore, AuthStore };

const actions = {
  onToggle: onToggleShare,
};

export default altConnect(mapStateToProps, actions)(RecommendButtonNew);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/RecommendButtonContainer.js