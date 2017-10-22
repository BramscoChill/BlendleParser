import React, { PropTypes } from 'react';
import altConnect from 'higher-order-components/altConnect';
import { STATUS_INITIAL } from 'app-constants';
import ItemStore from 'stores/ItemStore';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import { getManifest } from 'selectors/tiles';
import { getTitle, getManifestBody } from 'helpers/manifest';
import { textToSpeechEnabled } from 'selectors/labExperiments';
import ItemToSpeechActions from 'actions/ItemToSpeechActions';
import ItemToSpeechStore from 'stores/ItemToSpeechStore';
import hasPrivateLabAccess from 'helpers/hasPrivateLabAccess';
import ItemToSpeech from '../components/ItemToSpeech';

function toggleSpeech() {
  const { selectedItemId } = ItemStore.getState();
  const audioItem = ItemToSpeechStore.getState().items.get(selectedItemId);

  if (!audioItem) {
    ItemToSpeechActions.fetchItemToSpeechUrl(selectedItemId);
  }

  const toggle = !audioItem ? true : !audioItem.isActive;
  ItemToSpeechActions.toggleControls({
    itemId: selectedItemId,
    toggle,
  });
}

const MaybeItemToSpeech = ({ isHidden, ...props }) => !isHidden && <ItemToSpeech {...props} />;

MaybeItemToSpeech.propTypes = {
  isHidden: PropTypes.bool,
};

function mapStateToProps({ itemToSpeechState, itemState, authState, tilesState }) {
  const { user } = authState;
  const { selectedItemId } = itemState;
  const isActiveInLab = hasPrivateLabAccess(user) && textToSpeechEnabled();

  if (!selectedItemId || !isActiveInLab) {
    // TODO: How can this happen? The Topbar should unmount when there is no selectedItemId
    // Altconnect issue maybe?
    return { isHidden: true };
  }

  const manifest = getManifest(tilesState.tiles, selectedItemId);
  const itemToSpeechItem = itemToSpeechState.items.get(selectedItemId);

  if (!itemToSpeechItem) {
    return {
      isActive: false,
      status: STATUS_INITIAL,
    };
  }

  return {
    url: itemToSpeechItem.url,
    isActive: itemToSpeechItem.isActive,
    status: itemToSpeechItem.status,
    title: getTitle(getManifestBody(manifest)),
  };
}

mapStateToProps.stores = { AuthStore, ItemStore, ItemToSpeechStore, TilesStore };

export default altConnect(mapStateToProps, { onClick: toggleSpeech })(MaybeItemToSpeech);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ItemToSpeechContainer.js