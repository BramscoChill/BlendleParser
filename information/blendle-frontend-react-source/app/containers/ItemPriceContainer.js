import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import { isActive } from 'selectors/subscriptions';
import { isPremiumItemTile } from 'selectors/tiles';
import ItemPrice from 'components/ItemPrice';
import AltContainer from 'alt-container';

class ItemPriceContainer extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string,
    color: ItemPrice.propTypes.color,
    className: ItemPrice.propTypes.className,
  };

  _renderItemPrice = ({ premiumState, authState, tilesState }) => {
    const { itemId, ...restProps } = this.props;
    const tile = tilesState.tiles.get(itemId);
    const { user } = authState;

    if (!tile) {
      return null;
    }

    const manifest = tile._embedded['b:manifest'];
    const isPremiumItem = isPremiumItemTile(tilesState.tiles, itemId);
    const userHasPremium = premiumState.subscription && isActive(premiumState.subscription);
    const hasProviderSubscription = user.hasActiveSubscription(manifest.provider.id);
    const itemFromSubscription = hasProviderSubscription || (isPremiumItem && userHasPremium);

    return (
      <ItemPrice
        price={tile.price}
        subscription={!!itemFromSubscription}
        purchased={tile.item_purchased}
        isItemOpened={!!tile.opened}
        isPremiumItem={isPremiumItem}
        issuePurchased={tile.issue_purchased}
        isFreeloader={user.isFreeloader() || false}
        {...restProps}
      />
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          premiumState: PremiumSubscriptionStore,
          tilesState: TilesStore,
          authState: AuthStore,
        }}
        render={this._renderItemPrice}
      />
    );
  }
}

export default ItemPriceContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/ItemPriceContainer.js