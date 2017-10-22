import RefundActions from 'actions/RefundActions';
import ItemActions from 'actions/ItemActions';
import RefundStore from 'stores/RefundStore';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import { getItemFromTiles } from 'selectors/tiles';

export function refund(reason) {
  const { message } = RefundStore.getState();
  const { user } = AuthStore.getState();
  const { selectedItemId: id } = ItemStore.getState();
  const tile = getItemFromTiles(id, TilesStore.getState());
  const item = { ...tile, id };

  ItemActions.setAutoRefundable(false);
  RefundActions.refundItem(item, user, reason, message);
}



// WEBPACK FOOTER //
// ./src/js/app/modules/item/helpers/refund.js