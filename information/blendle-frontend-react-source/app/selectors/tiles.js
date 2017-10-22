import { isBundleItem } from 'selectors/item';
import { get } from 'lodash';
import { getManifestBody, getTitle, getContentAsText } from 'helpers/manifest';
import { itemHeadline, itemIntro } from 'selectors/itemMetadata';
import { getPosts as getTilePosts } from 'selectors/tile';

export const getTileManifest = tile => get(tile, '_embedded[b:manifest]');

export const getItemFromTiles = (itemId, tilesStore) => tilesStore.tiles.get(itemId);

export function getRecommendationReasons(itemId, tilesState) {
  return get(getItemFromTiles(itemId, tilesState), 'recommendation_reasons', []);
}

/**
 * Removes items from the given collection without an b:manifest resource.
 * This occur when backend zooming-proxy fails and responses with an { message } object.
 * @param {Array} tiles
 * @returns {Array}
 */
export function validTiles(tiles) {
  return tiles.filter(tile => !!tile && !!getTileManifest(tile));
}

export function tilesByIds(itemIds, tilesState) {
  return validTiles(itemIds.map(itemId => getItemFromTiles(itemId, tilesState)));
}

export function getTimelineTiles(tiles, itemIds) {
  return validTiles(itemIds.map(tiles.get, tiles));
}

export function getManifest(tiles, itemId) {
  return getTileManifest(tiles.get(itemId));
}

export function getDate(tiles, itemId) {
  return getManifest(tiles, itemId).date;
}

export function getPostCount(tiles, itemId) {
  return tiles.get(itemId).post_count;
}

export function getPosts(tiles, itemId) {
  const tile = tiles.get(itemId);
  return getTilePosts(tile);
}

export function getChannelPosts(tiles, itemId) {
  return tiles.get(itemId)['channel-posts'] || [];
}

export function getPin(tiles, itemId) {
  return tiles.get(itemId).pinned;
}

export function isPremiumItemTile(tiles, itemId) {
  return isBundleItem(tiles.get(itemId));
}

export const getTileTitle = (tile) => {
  const metaData = tile._embedded['b:metadata'];
  const manifestBody = getManifestBody(getTileManifest(tile));

  const recommendationTitle = metaData && itemHeadline(metaData);
  return recommendationTitle || getContentAsText(getTitle(manifestBody));
};

export const getTileIntro = (tile) => {
  const metaData = tile._embedded['b:metadata'];

  return metaData && itemIntro(metaData);
};

export const getTileId = tile => get(getTileManifest(tile), 'id');

/**
 * sort an array of tiles and put the purchased items to the end
 *
 * @export
 * @param {object} tiles
 */
export function sortPurchased(tiles) {
  // Array.prototype.sort will not work
  // hold sort, only put purchased at the end
  const purchased = [];
  const unpurchased = [];
  for (const item of tiles) {
    if (item.item_purchased) {
      purchased.push(item);
    } else {
      unpurchased.push(item);
    }
  }

  return [...unpurchased, ...purchased];
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/tiles.js