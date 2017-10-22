import altConnect from 'higher-order-components/altConnect';
import ItemStore from 'stores/ItemStore';
import { getTileManifest } from 'selectors/tiles';
import { isBundleItem } from 'selectors/item';
import TilesStore from 'stores/TilesStore';
import ExperimentsStore from 'stores/ExperimentsStore';
import AuthStore from 'stores/AuthStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import { assignExperimentVariant } from 'helpers/experiments';
import { PremiumLabelsOnCards, PremiumLabelsOnCardsLabels } from 'config/runningExperiments';
import ItemMeta from '../components/ItemMeta';

function shouldShowPremiumLabel(experimentsState, subscription, user, tile) {
  if (subscription) {
    const variant = assignExperimentVariant(PremiumLabelsOnCards, experimentsState, user);

    return variant === PremiumLabelsOnCardsLabels && isBundleItem(tile);
  }

  return false;
}

function mapStateToProps({
  itemState,
  tilesState,
  premiumSubscriptionState,
  experimentsState,
  authState,
}) {
  const { selectedItemId } = itemState;
  const tile = tilesState.tiles.get(selectedItemId);

  if (!tile) {
    return null;
  }

  const manifest = getTileManifest(tile);
  const { user } = authState;
  const { subscription } = premiumSubscriptionState;

  return {
    date: manifest.date,
    length: manifest.length,
    showPremiumLabel: shouldShowPremiumLabel(experimentsState, subscription, user, tile),
  };
}

mapStateToProps.stores = {
  ItemStore,
  TilesStore,
  PremiumSubscriptionStore,
  ExperimentsStore,
  AuthStore,
};

export default altConnect(mapStateToProps)(ItemMeta);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ItemMetaContainer.js