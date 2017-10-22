import alt from 'instances/altInstance';
import Settings from 'controllers/settings';
import axios from 'axios';

class TileActions {
  fetchTile(userId, itemId) {
    const link = Settings.getLink('user_item_tile', {
      user_id: userId,
      item_id: itemId,
    });

    axios
      .get(link, {
        headers: {
          accept: 'application/hal+json',
          'X-Tile-Version': 3, // Use new tile endpoint version
        },
      })
      .then(response => response.data)
      .then(tile => this.fetchTileSuccess(tile));

    return null;
  }

  fetchTiles(userId, itemIds) {
    const link = Settings.getLink('user_item_tiles', {
      user_id: userId,
      item_ids: itemIds.join(','),
    });

    axios
      .get(link, {
        headers: {
          accept: 'application/hal+json',
        },
      })
      .then(response => response.data)
      .then(tile => this.fetchTilesSuccess(tile));

    return null;
  }

  fetchTileSuccess(tile) {
    return { tile };
  }

  fetchTilesSuccess(tiles) {
    return { tiles };
  }
}

export default alt.createActions(TileActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/TileActions.js