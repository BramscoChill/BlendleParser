import AuthStore from 'stores/AuthStore';
import ItemActions from 'actions/ItemActions';

export default function loadItem(itemId) {
  const { user } = AuthStore.getState();

  ItemActions.fetchContent.defer(itemId, user.id);
  ItemActions.fetchItem.defer(itemId);
}



// WEBPACK FOOTER //
// ./src/js/app/modules/item/helpers/loadItem.js