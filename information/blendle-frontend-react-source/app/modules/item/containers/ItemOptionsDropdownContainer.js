import altConnect from 'higher-order-components/altConnect';
import ItemStore from 'stores/ItemStore';
import ItemActions from 'actions/ItemActions';
import TilesStore from 'stores/TilesStore';
import { getManifest } from 'selectors/tiles';
import { getTitle, getManifestBody } from 'helpers/manifest';
import SharingActions from 'actions/ShareActions';
import Analytics from 'instances/analytics';
import AuthStore from 'stores/AuthStore';
import OptionsDropdown from '../components/TopBar/OptionsDropdown';

const analytics = {};

function onClickPocket(e) {
  e.preventDefault();
  const { selectedItemId } = ItemStore.getState();
  Analytics.track('Share To Pocket', analytics);

  SharingActions.shareToPocket(selectedItemId);
}

function onClickIssue() {
  const { selectedItemId } = ItemStore.getState();
  const { tiles } = TilesStore.getState();

  const manifest = getManifest(tiles, selectedItemId);

  Analytics.track('Open Corresponding Issue', {
    item_id: manifest.id,
    item_title: getTitle(getManifestBody(manifest)),
    provider_id: manifest.provider.id,
    issue_id: manifest.issue.id,
  });
}

function onPrint(e) {
  e.preventDefault();

  const { selectedItemId } = ItemStore.getState();
  const { tiles } = TilesStore.getState();

  const manifest = getManifest(tiles, selectedItemId);

  ItemActions.print({
    item_id: selectedItemId,
    provider_id: manifest.provider.id,
  });
}

function mapStateToProps({ itemState, tilesState, authState }) {
  const { user } = authState;
  const { selectedItemId } = itemState;
  const { tiles } = tilesState;
  const tile = tiles.get(selectedItemId);

  if (!tile) {
    return null;
  }

  const manifest = getManifest(tiles, selectedItemId);

  return {
    itemPrice: tile.price / 100, // Price is in cents
    refundable: tile.refundable && !user.isFreeloader(),
    providerId: manifest.provider.id,
    issueId: manifest.issue.id,
    itemId: selectedItemId,
    analytics,
    date: manifest.date,
    itemLength: manifest.length,
    onClickPocket,
    onClickIssue,
    onPrint,
  };
}
mapStateToProps.stores = { ItemStore, TilesStore, AuthStore };

const actions = {
  onClickPocket,
  onClickIssue,
  onPrint,
};

export default altConnect(mapStateToProps, actions)(OptionsDropdown);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ItemOptionsDropdownContainer.js