import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import FavoriteProvidersActions from 'actions/FavoriteProvidersActions';

class FavoriteProvidersStore {
  constructor() {
    this.bindActions(FavoriteProvidersActions);

    this.state = {
      favorites: [],
      status: STATUS_INITIAL,
      message: null,
    };
  }

  onFetchFavoriteProviders() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onFetchFavoriteProvidersSuccess({ favorites }) {
    this.setState({
      status: STATUS_OK,
      favorites,
    });
  }

  onFetchFavoriteProvidersError({ message }) {
    this.setState({
      status: STATUS_ERROR,
      message,
    });
  }

  onFavoriteProvider({ providerId, toggle }) {
    if (toggle) {
      this.setState({
        favorites: [...this.state.favorites, providerId],
      });
      return;
    }

    this.setState({
      favorites: this.state.favorites.filter(favorite => favorite !== providerId),
    });
  }
}

export default alt.createStore(FavoriteProvidersStore, 'FavoriteProvidersStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/FavoriteProvidersStore.js