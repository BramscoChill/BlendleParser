import altConnect from 'higher-order-components/altConnect';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import { compose, withProps, onlyUpdateForKeys, mapProps } from 'recompose';
import { map } from 'lodash/fp';
import { getTileManifest, getTileTitle, getTileIntro, getItemFromTiles } from 'selectors/tiles';
import { getPosts, isRead } from 'selectors/tile';
import { getAvatarLink } from 'selectors/post';
import { getTileBackground } from 'helpers/tiles';
import { getReadingTime } from 'helpers/manifest';
import { createItemUri } from 'helpers/prettyurl';
import ItemActions from 'actions/ItemActions';
import SectionTile from '../components/SectionTile';
import { parallaxScrolling } from '../components/SectionTile/features';
import { PARALLAX_DISTANCE_PX } from '../constants';

const isPinned = tile => tile.pinned;

/**
 * Get avatar URLs from an array of tiles
 * @param {Array[tile]}   tiles   Array of tiles
 * @type  {Array[string]} avatars Array containing avatar URLs
 */
const getAvatars = compose(map(getAvatarLink), getPosts);

/**
 * Get the height of the tile backgroud image. The image should be a little bit taller for tiles
 * with the parallax feature enabled (because the image 'scrolls').
 * @param  {Number} tileHeight The height of the tile
 * @param  {Number} features   An array of features for this tile
 * @return {Number}            The height of the background image for the tile
 */
const getTileBackgroundHeight = (tileHeight, features) => {
  if (features.includes(parallaxScrolling)) {
    const totalParallaxSize = PARALLAX_DISTANCE_PX * 2;
    return tileHeight + totalParallaxSize;
  }

  return tileHeight;
};

const actions = {
  setPinState: (itemId, nextPinState, analytics) => {
    const user = AuthStore.getState().user;
    const item = getItemFromTiles(itemId, TilesStore.getState());

    ItemActions.pinItem(user, item, nextPinState, analytics);
  },
};

function propsMapper({
  tile,
  getBrandingVariant,
  tileWidth,
  tileHeight,
  features = [],
  analytics,
}) {
  const manifest = getTileManifest(tile);

  const backgroundImage = getTileBackground({
    manifest,
    tileWidth,
    tileHeight: getTileBackgroundHeight(tileHeight, features),
    widthInterval: false,
    heightInterval: false,
  });

  const brandingVariant = getBrandingVariant();
  const brandingBackgroundColor = brandingVariant.background();
  const brandingForegroundColor = brandingVariant.foreground();
  const brandingPosition = brandingVariant.position;

  const itemUrl = createItemUri(manifest);

  const readingTime = getReadingTime(manifest.length);

  const postCount = tile.post_count;
  const friendPostCount = (tile['followed-user-posts'] || []).length;
  const shouldShowPostCount = friendPostCount !== 0 || postCount >= 10;

  return {
    analytics,
    itemUrl,
    itemId: manifest.id,
    backgroundImage: backgroundImage && backgroundImage.href,
    backgroundImageCredits: backgroundImage && backgroundImage.credit,
    brandingBackgroundColor,
    brandingForegroundColor,
    brandingPosition,
    isRead: isRead(tile),
    readingTime,
    providerId: manifest.provider.id,
    title: getTileTitle(tile),
    intro: getTileIntro(tile),
    postCount,
    shouldShowPostCount,
    avatars: getAvatars(tile),
    isPinned: isPinned(tile),
    tileWidth,
    features,
  };
}

function mapStateToProps({ tilesState }, { itemId, ...rest }) {
  const tile = getItemFromTiles(itemId, tilesState);
  return {
    tile: getItemFromTiles(itemId, tilesState),
    isHidden: !tile,
    itemId,
    ...rest,
  };
}

mapStateToProps.stores = { TilesStore };

const enhance = compose(
  altConnect(mapStateToProps),
  // Because sometimes the tilesstore is not updated soon enough
  renderNothingIfIsHidden,
  onlyUpdateForKeys(['tile', 'tileWidth', 'tileHeight', 'analytics']),
  mapProps(propsMapper),
  withProps(actions),
);

export default enhance(SectionTile);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/containers/SectionTileContainer.js