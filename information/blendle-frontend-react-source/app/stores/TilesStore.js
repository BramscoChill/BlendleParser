import alt from 'instances/altInstance';
import TimelineActions from 'actions/TimelineActions';
import BundlesActions from 'actions/BundlesActions';
import AlertsActions from 'actions/AlertsActions';
import TrendingSuggestionsActions from 'actions/TrendingSuggestionsActions';
import SearchActions from 'actions/SearchActions';
import TileActions from 'actions/TileActions';
import ItemActions from 'actions/ItemActions';
import SectionsPageActions from 'modules/sectionsPage/actions/SectionsPageActions';
import StoriesActions from 'modules/stories/actions/StoriesActions';
// import ShareActions from 'actions/ShareActions';
import RefundActions from 'actions/RefundActions';
import ItemAcquisitionActions from 'actions/ItemAcquisitionActions';
import { getItemId } from 'selectors/item';

class TilesStore {
  constructor() {
    this.bindActions(TimelineActions);
    this.bindActions(BundlesActions);
    this.bindActions(TrendingSuggestionsActions);
    this.bindActions(SearchActions);
    this.bindAction(AlertsActions.FETCH_RESULTS_SUCCESS, this.onFetchAlertsResultsSuccess);
    this.bindAction(AlertsActions.FETCH_NEXT_RESULTS_SUCCESS, this.onFetchNextAlertsResultsSuccess);
    this.bindAction(TileActions.FETCH_TILE_SUCCESS, this.onFetchTileSuccess);
    this.bindAction(TileActions.FETCH_TILES_SUCCESS, this.onFetchTilesSuccess);
    this.bindAction(ItemActions.PIN_ITEM, this.onPinItem);
    this.bindAction(ItemAcquisitionActions.ACQUIRE_ITEM_SUCCESS, this.onAcquireItemSuccess);
    this.bindAction(RefundActions.REFUND_ITEM_SUCCESS, this.onRefundItemSuccess);
    this.bindAction(SectionsPageActions.FETCH_SECTION_FEED_SUCCESS, this.onFetchSectionFeedSuccess);
    this.bindAction(StoriesActions.FETCH_STORY_TILES_SUCCESS, this.onFetchStoryTilesSuccess);
    // this.bindAction(ShareActions.SHARE_TO_POCKET, this.onSharePocket);

    this.state = {
      tiles: new Map(), // key (itemId) value (tile)
    };
  }

  _saveNewTiles(newTiles) {
    const currentTiles = this.state.tiles;

    newTiles.forEach((tile) => {
      const currentTile = currentTiles.get(getItemId(tile));

      if (currentTile) {
        delete currentTile['user-post']; // Remove from old tile, else it can't be deleted
      }

      currentTiles.set(getItemId(tile), {
        ...currentTile,
        ...tile,
      });
    });

    this.setState({ currentTiles });
  }

  onFetchTimelineSuccess({ items }) {
    this._saveNewTiles(items);
  }

  onFetchNextItemsSuccess({ items }) {
    this._saveNewTiles(items);
  }

  onFetchBundleSuccess({ bundle }) {
    const bundleTiles = bundle._embedded['b:tiles'];

    this._saveNewTiles(bundleTiles);
  }

  onFetchSuggestionTilesSuccess({ tiles }) {
    this._saveNewTiles(tiles);
  }

  onFetchResultsSuccess({ items }) {
    this._saveNewTiles(items.tiles);
  }

  onFetchNextResultsSuccess({ items }) {
    this._saveNewTiles(items.tiles);
  }

  onFetchAlertsResultsSuccess({ tiles }) {
    this._saveNewTiles(tiles);
  }

  onFetchNextAlertsResultsSuccess({ tiles }) {
    this._saveNewTiles(tiles);
  }

  onFetchTileSuccess({ tile }) {
    this._saveNewTiles([tile]);
  }

  onFetchTilesSuccess({ tiles }) {
    this._saveNewTiles(tiles._embedded['b:tiles']);
  }

  onFetchBundleTilesSuccess({ bundleTiles }) {
    this._saveNewTiles(bundleTiles);
  }

  onFetchTileSwapCandidateSuccess({ tile }) {
    this._saveNewTiles([tile]);
  }

  onSharePocket({ itemId }) {
    const storeTiles = this.state.tiles;
    const tile = storeTiles.get(itemId);

    if (tile) {
      storeTiles.set(itemId, {
        ...tile,
        refundable: false,
      });
      this.settState({ tiles: storeTiles });
    }
  }

  onPinItem({ itemId, pinned }) {
    const storeTiles = this.state.tiles;
    const tile = storeTiles.get(itemId);

    if (tile) {
      storeTiles.set(itemId, {
        ...tile,
        pinned,
      });
      this.setState({ tiles: storeTiles });
    }
  }

  onAcquireItemSuccess({ itemId }) {
    const storeTiles = this.state.tiles;
    const tile = storeTiles.get(itemId);

    if (tile) {
      storeTiles.set(itemId, {
        ...tile,
        item_purchased: true,
      });
      this.setState({ tiles: storeTiles });
    }
  }

  onRefundItemSuccess({ itemId }) {
    const storeTiles = this.state.tiles;
    const tile = storeTiles.get(itemId);

    if (tile) {
      storeTiles.set(itemId, {
        ...tile,
        item_purchased: false,
      });
      this.setState({ tiles: storeTiles });
    }
  }

  onFetchSectionFeedSuccess({ tiles }) {
    this._saveNewTiles(tiles);
  }

  onFetchStoryTilesSuccess({ tiles }) {
    this._saveNewTiles(tiles);
  }
}

export default alt.createStore(TilesStore, 'TilesStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/TilesStore.js