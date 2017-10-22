/* eslint-disable class-methods-use-this */
import alt from 'instances/altInstance';
import { takeRight } from 'lodash';
import { setItem, getItem } from 'helpers/localStorage';

const LOCAL_STORAGE_KEY = 'SEEN_ITEMS';
const STORAGE_DELIMITER = ',';
const MAX_LOCALSTORAGE_ITEMS = 500;

const setItemIdsInStorage = itemIds => setItem(LOCAL_STORAGE_KEY, itemIds.join(STORAGE_DELIMITER));
const getItemIdsInStorage = () => (getItem(LOCAL_STORAGE_KEY) || '').split(STORAGE_DELIMITER);

function updateLocalStorage(itemId) {
  const itemIds = getItemIdsInStorage();
  itemIds.push(itemId);
  setItemIdsInStorage(itemIds);
}

class SeenItemsActions {
  fillStoreWithSeenItemIds() {
    const itemsMap = new Map();
    const allItemIds = getItemIdsInStorage();

    // Only take the last 500 items to make sure localStorage doesn't get too full
    const cappedItemIds = takeRight(allItemIds, MAX_LOCALSTORAGE_ITEMS);
    cappedItemIds.forEach(itemId => itemsMap.set(itemId, true));

    if (allItemIds > MAX_LOCALSTORAGE_ITEMS) {
      setItemIdsInStorage(cappedItemIds);
    }

    return itemsMap;
  }

  markItemSeen(itemId) {
    window.requestIdleCallback(() => updateLocalStorage(itemId));
    return itemId;
  }
}

export default alt.createActions(SeenItemsActions);



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/actions/SeenItemsActions.js