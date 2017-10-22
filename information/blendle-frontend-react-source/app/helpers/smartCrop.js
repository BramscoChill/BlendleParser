import Environment from 'environment';
import { getPathname, param } from 'helpers/url';

const DEFAULT_COLUMN_WIDTH = 500;
const DEFAULT_ROW_HEIGHT = 500;
const DIMENSION_INTERVAL = 250;

const defaultSmartCropOption = {
  widthInterval: true,
  heightInterval: true,
  interval: 150,
};

const defaultImgixOptions = {
  auto: 'format',
  fit: 'crop',
  crop: 'edges,entropy,faces',
  trim: 'auto',
};

export function getSmartCropDimension(dimension, interval, maxSize = 0) {
  const itemInterval = interval || DIMENSION_INTERVAL;

  let chosenDimension = itemInterval;
  while (dimension > chosenDimension) {
    chosenDimension += itemInterval;
  }

  return Math.min(chosenDimension, maxSize); // Never request image larger than the max width
}

export function smartCropImage(originalImage, cropOptions) {
  const options = Object.assign({}, defaultSmartCropOption, cropOptions);
  const imgixOptions = Object.assign({}, defaultImgixOptions, cropOptions.imgixOptions);
  const { width, height, interval, widthInterval, heightInterval } = options;

  const cropWidth = width
    ? Math.round(
        widthInterval ? getSmartCropDimension(width, interval, originalImage.width) : width,
      )
    : null;
  const cropHeight = height
    ? Math.round(
        heightInterval ? getSmartCropDimension(height, interval, originalImage.height) : height,
      )
    : null;

  const queryFilters = {
    w: cropWidth,
    h: cropHeight,
    ...imgixOptions,
  };
  Object.keys(queryFilters).forEach(key => queryFilters[key] == null && delete queryFilters[key]);

  return `${originalImage.href}?${param(queryFilters)}`;
}

function smartCropGridItem(originalImage, columns, rows, itemDimension) {
  const width = (itemDimension || DEFAULT_COLUMN_WIDTH) * columns;
  const height = (itemDimension || DEFAULT_ROW_HEIGHT) * rows;

  return smartCropImage(originalImage, {
    width,
    height,
    widthInterval: false,
    heightInterval: false,
  });
}

export function smartCropImageGrids(grids, containerDimension, images) {
  let imageCounter = 0;
  grids.forEach((grid) => {
    grid.patterns.forEach((pattern) => {
      const imageSizes = images[imageCounter++].sizes;
      if (imageSizes && imageSizes.original) {
        pattern.href = smartCropGridItem(
          imageSizes.original,
          pattern.columns,
          pattern.rows,
          getSmartCropDimension(containerDimension),
        ); // eslint-disable-line no-param-reassign
      }
    });
  });
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/smartCrop.js