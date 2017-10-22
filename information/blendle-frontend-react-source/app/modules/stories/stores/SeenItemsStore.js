import alt from 'instances/altInstance';
import { STATUS_INITIAL, STATUS_OK } from 'app-constants';
import SeenItemsActions from '../actions/SeenItemsActions';

class SeenItemsStore {
  state = {
    status: STATUS_INITIAL,
    seenItems: new Map(),
  };

  constructor() {
    this.bindActions(SeenItemsActions);
  }

  onFillStoreWithSeenItemIds(seenItems) {
    this.setState({
      status: STATUS_OK,
      seenItems,
    });
  }

  onMarkItemSeen(itemId) {
    const seenItems = new Map(...this.state.seenItems);
    seenItems.set(itemId, true);

    this.setState({
      seenItems,
    });
  }
}

export default alt.createStore(SeenItemsStore, 'SeenItemsStore');



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/stores/SeenItemsStore.js