import { STATUS_PENDING, STATUS_OK } from 'app-constants';
import alt from 'instances/altInstance';
import TrendingSuggestionsActions from 'actions/TrendingSuggestionsActions';
import { merge } from 'lodash';
import { getItemId } from 'selectors/item';

class TrendingSuggestionsStore {
  constructor() {
    this.bindActions(TrendingSuggestionsActions);
    this.state = {};
  }

  onFetchTrendingTiles(itemId) {
    const newState = merge(this.state, {
      [itemId]: {
        trendingStatus: STATUS_PENDING,
      },
    });
    this.setState(newState);
  }

  onFetchSuggestionTilesSuccess({ suggestionType, tiles, itemId }) {
    const newState = {
      ...this.state,
      [itemId]: {
        ...this.state[itemId],
        [`${suggestionType}Status`]: STATUS_OK,
        [`${suggestionType}TileIds`]: tiles.map(tile => getItemId(tile)),
      },
    };

    this.setState(newState);
  }

  onFetchRelatedTiles(itemId) {
    const newState = merge(this.state, {
      [itemId]: {
        relatedStatus: STATUS_PENDING,
      },
    });
    this.setState(newState);
  }

  onFetchPopularTiles(itemId) {
    const newState = merge(this.state, {
      [itemId]: {
        popularStatus: STATUS_PENDING,
      },
    });
    this.setState(newState);
  }
}

export default alt.createStore(TrendingSuggestionsStore, 'TrendingSuggestionsStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/TrendingSuggestionsStore.js