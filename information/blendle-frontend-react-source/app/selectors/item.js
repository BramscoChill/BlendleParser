import { get } from 'lodash';

export function getItemId(item) {
  return item.id || item._embedded['b:manifest'].id;
}

export const isBundleItem = (item) => {
  // Also support tile items
  const itemBundles = (item.get ? item.get('item_bundled_in') : item.item_bundled_in) || [];

  return itemBundles.includes('premium');
};

export function isItemAcquired(itemState) {
  return get(itemState, 'acquisition.acquired', false);
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/item.js