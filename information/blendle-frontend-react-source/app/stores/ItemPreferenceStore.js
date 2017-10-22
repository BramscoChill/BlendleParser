import { STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import ItemPreferenceActions from '../actions/ItemPreferenceActions';

const updateItem = (state, itemState, itemId) => ({
  preferences: {
    ...state.preferences,
    [itemId]: itemState,
  },
});

class ItemPreferenceStore {
  constructor() {
    this.bindActions(ItemPreferenceActions);

    this.state = {
      preferences: {},
    };
  }

  onFetchPreference({ itemId }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_PENDING,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onFetchPreferenceSuccess({ itemId, data }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_OK,
        data,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onFetchPreferenceError({ itemId, error }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_ERROR,
        error,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onSendNegativePreference({ itemId }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_PENDING,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onSendNegativePreferenceSuccess({ itemId, data }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_OK,
        data,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onSendNegativePreferenceError({ itemId, error }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_ERROR,
        error,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onDeleteNegativePreference({ itemId }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_PENDING,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onDeleteNegativePreferenceSuccess({ itemId }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_OK,
      },
      itemId,
    );

    this.setState(nextState);
  }

  onDeleteNegativePreferenceError({ itemId, error }) {
    const nextState = updateItem(
      this.state,
      {
        status: STATUS_ERROR,
        error,
      },
      itemId,
    );

    this.setState(nextState);
  }
}

export default alt.createStore(ItemPreferenceStore, 'ItemPreferenceStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ItemPreferenceStore.js