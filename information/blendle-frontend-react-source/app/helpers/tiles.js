import { memoize, get } from 'lodash';
import { CHANNEL_COLORS, STAFFPICKS_CHANNELS } from 'app-constants';
import { MAX_PREMIUM_TILE_HEIGHT } from 'app-constants';
import { smartCropImages } from 'config/features';
import { getManifestImageHref } from 'selectors/itemImage';

export const getTileChannel = memoize((tile, channels) => {
  // First, check if there is a channel post (only channels that a user follows)
  const channelPosts = tile['channel-posts'];
  const postChannel =
    channelPosts &&
    channelPosts.find(channelPost => !STAFFPICKS_CHANNELS.includes(channelPost.channel_uid));
  if (postChannel) {
    return postChannel;
  }

  // Take the first from all channels if no followed channels
  const tileChannels =
    get(tile, 'channels', null) || get(tile, ['_embedded', 'b:metadata', 'channels'], null);

  if (!tileChannels) {
    return null;
  }

  const channelIds = tileChannels.map(tileChannel => tileChannel.uid);

  // Filter out new or non existing channels
  const storeChannel = channels.find(channel => channelIds.includes(channel.id));
  return storeChannel
    ? {
      channel_name: storeChannel.get('full_name'),
      channel_uid: storeChannel.id,
    }
    : null;
}, tile => tile._embedded['b:manifest'].id);

export const getChannelColor = (channel, isMustRead) => {
  const colorKey = isMustRead ? 'mustread' : get(channel, 'channel_uid');

  // Default to staffpicks color on no channel
  return CHANNEL_COLORS[colorKey] || CHANNEL_COLORS.staffpicks;
};

const ALLOWED_ASPECT_RATIO_DIFFERENCE = 5;

export const getTileBackground = memoize(
  ({
    manifest,
    tileWidth,
    tileHeight,
    mobile,
    interval = 75,
    widthInterval = mobile,
    heightInterval = !mobile && tileHeight !== MAX_PREMIUM_TILE_HEIGHT,
  }) => {
    const maxAspectRatio = tileWidth / tileHeight + ALLOWED_ASPECT_RATIO_DIFFERENCE;

    const smartCropOptions = {
      width: Math.round(tileWidth * 1.05),
      height: Math.round(tileHeight * 1.05),
      interval, // Better cropping interval on premium tiles
      widthInterval,
      heightInterval,
    };

    return getManifestImageHref(manifest, {
      smartCrop: smartCropImages,
      smartCropOptions,
      criteria: {
        minWidth: tileWidth * 0.8,
        minHeight: tileHeight * 0.7,
        hasCredits: false,
        maxAspectRatio,
      },
    });
  },
  ({ manifest, tileWidth, tileHeight, mobile }) =>
    `${manifest.id}::${tileWidth}::${tileHeight}::${mobile}`,
);



// WEBPACK FOOTER //
// ./src/js/app/helpers/tiles.js