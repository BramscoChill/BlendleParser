/**
 * Get the optimal dimensions for an iframe while retaining
 * the aspect ratio of the given width and height
 * @param options
 * @returns {{width: number, height: number}}
 */
export function maintainAspectRatio(options) {
  const { maxWidth, maxHeight, width, height, aspectRatio = height / width } = options;

  let iframeWidth = maxWidth;
  let iframeHeight = Math.round(iframeWidth * aspectRatio);

  if (iframeHeight > maxHeight) {
    // Base on height if the dimensions exceed the maxHeight
    iframeHeight = maxHeight;
    iframeWidth = iframeHeight / aspectRatio;
  }

  return {
    width: iframeWidth,
    height: iframeHeight,
  };
}

/**
 * Calculate the size of the other dimension for the given aspect ratio
 * @param {Object} options - The options to use for the calculation
 * @param {number} [options.width] - The known width to use in the calculation
 * @param {number} [options.height] - The known height to use in the calculation
 * @param { string } options.aspectRatio - The wanted aspect ratio supplied as a string e.g. 16:9
 *
 * @return {{ width: number, height: number }} The width and height in the correct aspect ratio
 */
export function getSizeForAspectRatio({ width, height, aspectRatio }) {
  const [arWidth, arHeight] = aspectRatio.split(':').map(arString => parseInt(arString, 10));

  if (!aspectRatio) {
    throw new Error('No aspect ratio supplied, supply an aspect ratio in the format 16:9');
  }

  if (!!width === !!height) {
    throw new Error('Either supply a width or height to calculate the size of the other dimension');
  }

  if (width) {
    const ratio = width / arWidth;
    return {
      width,
      height: Math.round(ratio * arHeight),
    };
  }

  const ratio = height / arHeight;
  return {
    width: Math.round(ratio * arWidth),
    height,
  };
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/aspectRatio.js