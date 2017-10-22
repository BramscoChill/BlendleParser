import { merge } from 'lodash';
import features from 'config/features';

/**
 * Get best size for key/value combination
 * @param  {Object} variants        Image variants
 * @param  {String} widthOrHeight   Key string
 * @param  {Number} mimimalAmount   Minimal value
 * @return {Array}                  Array of sizes, ordered by most optimal
 */
function getSizeForKey(variants, widthOrHeight, mimimalAmount) {
  return Object.keys(variants)
    .filter(variant => !features.excludeOriginalImages || variant !== 'original')
    .map(variant => ({
      size: variant,
      offset: variants[variant][widthOrHeight] - mimimalAmount,
    }))
    .filter(variant => variant.offset >= 0)
    .sort((a, b) => a.offset - b.offset)
    .map(variant => variant.size);
}

const optimalImage = {
  /**
   * Get XHD version of an image, is available
   * @param  {Object} variants   Image variants
   * @param  {String} normalSize The size of the regular image (e.g. 'small')
   * @return {String}            The XHD size of the image
   */
  getXHD(variants = {}, normalSize) {
    // If this is not a xhd display, or if we want the original size, we don't
    // have to look any further
    if (!window.BrowserDetect.isXHD() || normalSize === 'original') {
      return variants[normalSize];
    }

    const normalSquare = variants[normalSize].width * variants[normalSize].height;
    const xhdSquare = normalSquare * 4;

    return Object.keys(variants).reduce((currentBest, variant) => {
      const variantSquare = variants[variant].width * variants[variant].height;
      const xhdOffset = Math.abs(variantSquare - xhdSquare);

      let newBest = currentBest;
      if (typeof currentBest === 'string' || currentBest._xhdOffset >= xhdOffset) {
        newBest = merge(variants[variant], {
          _xhdOffset: xhdOffset,
          isXHD: variant !== normalSize,
        });
      }

      return newBest;
    });
  },

  /**
   * Get optimal image size for a specific height
   * @param  {Object} variants Image variants
   * @param  {Number} height   Height in pixel
   * @return {String}          Optimal size
   */
  getSizeForHeight(variants = {}, height) {
    const forHeight = getSizeForKey(variants, 'height', height);

    // Get first size that is large enough, but if no image is large enough, use the original size
    return forHeight[0] || 'original';
  },

  /**
   * Get optimal image size for a specific width
   * @param  {Object} variants Image variants
   * @param  {Number} width    Width in pixels
   * @return {String}          Optimal size
   */
  getSizeForWidth(variants = {}, width) {
    const forWidth = getSizeForKey(variants, 'width', width);

    // Get first size that is large enough, but if no image is large enough, use the original size
    return forWidth[0] || 'original';
  },

  getImageForWidth(image, targetWidth) {
    const imageData = image.sizes;
    const optimalSize = optimalImage.getSizeForWidth(imageData, targetWidth);
    const imageToUse = optimalImage.getXHD(imageData, optimalSize);

    imageToUse.caption = image.caption;
    imageToUse.credit = image.credit;

    return imageToUse;
  },

  /**
   * Get the largest allowed variant
   * @param variants
   */
  getLargestVariant(variants = {}) {
    return (
      (!features.excludeOriginalImages && variants.original) ||
      variants.large ||
      variants.medium ||
      variants.small
    );
  },
};

export default optimalImage;



// WEBPACK FOOTER //
// ./src/js/app/helpers/optimalImage.js