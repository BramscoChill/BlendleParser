import { compose, withState, withHandlers } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import { STATUS_PENDING } from 'app-constants';
import ShareActions from 'actions/ShareActions';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import ShareStore from 'stores/ShareStore';
import TilesStore from 'stores/TilesStore';
import { getManifest } from 'selectors/tiles';
import Analytics from 'instances/analytics';
import { openItemInApp } from 'helpers/openApp';
import { readerPremiumUpsell } from 'config/features';
import MobileStickySharing from '../components/MobileStickySharing';

const analytics = { location_in_layout: 'mobile-sticky-sharing-bottom-bar' };
function onSocialShare(platform) {
  const { user } = AuthStore.getState();
  const { tiles } = TilesStore.getState();
  const { selectedItemId } = ItemStore.getState();
  const manifest = getManifest(tiles, selectedItemId);
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

function mapStateToProps({ shareState, itemState, tilesState }) {
  const { selectedItemId } = itemState;
  const { tiles } = tilesState;
  const tile = tiles.get(selectedItemId);

  return {
    // State
    itemId: itemState.selectedItemId,
    blendleButtonActive: !!tile && !!tile['user-post'],
    blendleButtonLoading: shareState.status === STATUS_PENDING,
    showUpsellButton: readerPremiumUpsell,
    analytics,
  };
}
mapStateToProps.stores = { ShareStore, ItemStore, TilesStore };

const actions = {
  onSocialShare,
  onToggleBlendleShare,
};

const enhance = compose(
  altConnect(mapStateToProps, actions),
  withState('showSharer', 'setSharerVisibility', false),
  withHandlers({
    onToggleSharer: props => () => {
      const newValue = !props.showSharer;
      Analytics.track(newValue ? 'Open Social Share Bar' : 'Close Social Share Bar', analytics);
      props.setSharerVisibility(newValue);
    },
    openItemInAndroid: props => () => {
      openItemInApp(props.itemId);
    },
  }),
);

export default enhance(MobileStickySharing);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/MobileStickySharingContainer.js