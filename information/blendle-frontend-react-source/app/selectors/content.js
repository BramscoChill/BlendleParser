import { get, values } from 'lodash';

/**
 * Transform a media set image to a standardized image object
 * @param mediaSetImage - The image from the media set
 */
function transformMediaSetImage(mediaSetImage) {
  const { _embedded, ...rest } = mediaSetImage;
  return {
    sizes: Object.keys(_embedded).reduce((result, key) => {
      const size = _embedded[key];
      const { _links, ...dimensions } = size;
      return {
        [key]: {
          href: _links.file.href,
          ...dimensions,
        },
        ...result,
      };
    }, {}),
    ...rest,
  };
}

/**
 * Transforms an image from the content images array to a standardized object
 * @param itemImage
 */
function transformContentImage(contentImage) {
  const { _links, ...rest } = contentImage;
  return {
    sizes: _links,
    ...rest,
  };
}

export const getSubItems = content => get(content, '_embedded.items', []);

export const getYoutubeVideos = (content) => {
  const mediaSet = get(content, ['_embedded', 'b:media-sets'], null);
  if (!mediaSet) {
    return [];
  }

  return mediaSet.filter(item => item.type === 'youtube-video');
};

export const getImages = (content) => {
  const mediaSets = get(content, ['_embedded', 'b:media-sets'], null);

  if (mediaSets) {
    return mediaSets
      .filter(item => item.type === 'image')
      .map(item => transformMediaSetImage(item));
  }

  return content.images.map(image => transformContentImage(image));
};



// WEBPACK FOOTER //
// ./src/js/app/selectors/content.js