import React, { PureComponent } from 'react';
import RefundItem from '../components/RefundItem';
import TilesStore from 'stores/TilesStore';
import AltContainer from 'alt-container';

class RefundItemContainer extends PureComponent {
  _renderRefundItem = (tilesState) => {
    const { itemId } = this.props;
    const { tiles } = tilesState;
    const tile = tiles.get(itemId);

    if (tile && tile.refundable) {
      return <RefundItem price={tile.price} refundLink={`${window.location.pathname}/refund`} />;
    }

    return null;
  };

  render() {
    return <AltContainer render={this._renderRefundItem} store={TilesStore} />;
  }
}

export default RefundItemContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/RefundItemContainer.js