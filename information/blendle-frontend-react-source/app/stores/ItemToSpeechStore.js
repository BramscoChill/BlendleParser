import alt from 'instances/altInstance';
import { STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import ItemToSpeechActions from 'actions/ItemToSpeechActions';

class ItemToSpeechStore {
  constructor() {
    this.bindActions(ItemToSpeechActions);

    this.state = {
      items: new Map(), // key (itemId) value (itemSpeechUrl)
    };
  }

  onFetchItemToSpeechUrl({ itemId }) {
    const items = new Map(...this.state.items);
    const item = items.get(itemId);

    items.set(itemId, {
      ...item,
      isActive: true,
      status: STATUS_PENDING,
    });

    this.setState({ items });
  }

  onToggleControls({ itemId, toggle }) {
    const items = new Map(...this.state.items);
    const item = items.get(itemId);

    items.set(itemId, {
      ...item,
      isActive: toggle,
    });

    this.setState({ items });
  }

  onItemToSpeechUrlSuccess({ itemId, url }) {
    const items = new Map(...this.state.items);
    const item = items.get(itemId);

    items.set(itemId, {
      ...item,
      status: STATUS_OK,
      url,
    });

    this.setState({ items });
  }

  onItemToSpeechUrlError({ itemId, error }) {
    const items = new Map(...this.state.items);
    const item = items.get(itemId);

    items.set(itemId, {
      ...item,
      status: STATUS_ERROR,
      error,
    });

    this.setState({ items });
  }
}

export default alt.createStore(ItemToSpeechStore, 'ItemToSpeechStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ItemToSpeechStore.js