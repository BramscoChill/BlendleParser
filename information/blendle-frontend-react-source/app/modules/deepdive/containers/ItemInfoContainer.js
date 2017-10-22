import { string } from 'prop-types';
import { compose, setPropTypes, onlyUpdateForPropTypes } from 'recompose';
import { getTileManifest, getItemFromTiles, isPremiumItemTile } from 'selectors/tiles';
import { getReadingTime } from 'helpers/manifest';
import { isActive } from 'selectors/subscriptions';
import altConnect from 'higher-order-components/altConnect';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import ItemInfoBar from '../components/ItemInfoBar';

function mapStateToProps({ tilesState, authState, premiumSubscriptionState }, { itemId }) {
  const tile = getItemFromTiles(itemId, tilesState);
  if (!tile) {
    return { isLoading: true };
  }

  const manifest = getTileManifest(tile);
  const readingTime = getReadingTime(manifest.length);
  const hasProviderSubscription = authState.user.hasActiveSubscription(manifest.provider.id);
  const isPremiumItem = isPremiumItemTile(tilesState.tiles, itemId);
  const userHasPremium =
    premiumSubscriptionState.subscription && isActive(premiumSubscriptionState.subscription);

  const hasSubscription = hasProviderSubscription || Boolean(isPremiumItem && userHasPremium);

  return {
    isLoading: false,
    providerId: manifest.provider.id,
    price: tile.price / 100,
    hasSubscription,
    isPurchased: tile.item_purchased,
    readingTime,
  };
}

mapStateToProps.stores = { TilesStore, AuthStore, PremiumSubscriptionStore };

const enhance = compose(
  onlyUpdateForPropTypes,
  setPropTypes({
    itemId: string.isRequired,
  }),
  altConnect(mapStateToProps),
);

export default enhance(ItemInfoBar);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/containers/ItemInfoContainer.js