import { memoize } from 'lodash';

/**
 * Preloads an image from given url
 * @param  {String}         url  String with the url of the image
 * @return {Promise}             Promise that is called after success or error
 */
export const preloadImage = memoize(
  url =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onerror = reject;
      image.onload = resolve;
    }),
);

export function getHdImage(url1x, url2x) {
  return window.devicePixelRatio > 1.5 ? url2x : url1x;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/images.js