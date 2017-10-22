import altConnect from 'higher-order-components/altConnect';
import { isMobile } from 'instances/browser_environment';
import { STATUS_PENDING } from 'app-constants';
import ShareActions from 'actions/ShareActions';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import ShareStore from 'stores/ShareStore';
import TilesStore from 'stores/TilesStore';
import { getManifest } from 'selectors/tiles';
import { readerPremiumUpsell } from 'config/features';
import DesktopStickySharing from '../components/DesktopStickySharing';

/*
 * Custom Actions
 */
function onSocialShare(platform) {
  const { user } = AuthStore.getState();
  const { tiles } = TilesStore.getState();
  const { selectedItemId } = ItemStore.getState();
  const manifest = getManifest(tiles, selectedItemId);
  const analytics = { location_in_layout: 'sticky-sharing-bottom-bar' };
  ShareActions.shareItemToPlatform(platform, manifest, analytics, user);
}

function onToggleBlendleShare() {
  const { user } = AuthStore.getState();
  const { selectedItemId } = ItemStore.getState();
  const { tiles } = TilesStore.getState();
  const tile = tiles.get(selectedItemId);

  if (tile['user-post']) {
    ShareActions.removeShareToFollowing(selectedItemId, user.id);
  } else {
    ShareActions.shareToFollowing(selectedItemId, user.id);
  }
}

/*
 * Mappings
 */
const analytics = {}; // temponary fix
const mapStateToProps = ({ shareState, itemState, tilesState }) => {
  const { selectedItemId } = itemState;
  const { tiles } = tilesState;
  const tile = tiles.get(selectedItemId);

  return {
    // State
    itemId: itemState.selectedItemId,
    analytics,
    blendleButtonActive: tile && !!tile['user-post'],
    blendleButtonLoading: shareState.status === STATUS_PENDING,
    showUpsellButton: readerPremiumUpsell && isMobile(),
  };
};
mapStateToProps.stores = { ShareStore, ItemStore, TilesStore };

const actions = {
  onSocialShare,
  onToggleBlendleShare,
};

export default altConnect(mapStateToProps, actions)(DesktopStickySharing);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/DesktopStickySharingContainer.js