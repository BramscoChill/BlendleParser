import { getSizeForHeight, getSizeForWidth, getXHD } from 'helpers/optimalImage';
import { mapValues } from 'lodash';
import { smartCropImage } from 'helpers/smartCrop';

const defaultOptions = {
  smartCrop: false,
};

function mapMediasetSizes(sizes) {
  return mapValues(sizes, size => ({
    ...size,
    href: size._links.file.href,
  }));
}

function getImage(manifest) {
  manifest = manifest.get ? manifest.toJSON() : manifest;

  const mediaset = manifest._embedded ? manifest._embedded['b:media-set'] : null;
  const isMediaSet = !!mediaset;
  const image = isMediaSet
    ? mediaset
    : manifest.images.find(manifestImage => manifestImage.featured);

  if (!image) {
    return null;
  }

  const { _embedded, _links, ...rest } = image;
  return {
    isMediaSet,
    sizes: isMediaSet ? mapMediasetSizes(_embedded) : _links,
    ...rest,
  };
}

export function getImageSize(manifest, size) {
  const manifestImages = manifest && getImage(manifest);
  if (!manifestImages) {
    return null;
  }

  return manifestImages.sizes[size];
}

function imageMeetsCriteria(image, imageCriteria) {
  if (imageCriteria.hasCredits && !image.credit) {
    return false;
  }

  const sizes = image.sizes;
  const largest = sizes.original || sizes.large || sizes.medium || sizes.small;

  const aspectRatio = largest.width / largest.height;
  const isWidthValid = !imageCriteria.minWidth || largest.width >= imageCriteria.minWidth;
  const isHeightValid = !imageCriteria.minHeight || largest.height >= imageCriteria.minHeight;
  const isAspectRatioValid =
    !imageCriteria.aspectRatio || aspectRatio <= imageCriteria.maxAspectRatio;

  return isWidthValid && isHeightValid && isAspectRatioValid;
}

export const getManifestImageHref = (manifest, imageOptions) => {
  const options = {
    ...defaultOptions,
    ...imageOptions,
  };

  const image = getImage(manifest);
  if (!image || (image.isMediaSet && image.type !== 'image')) {
    return null;
  }

  if (options.criteria && !imageMeetsCriteria(image, options.criteria)) {
    return null;
  }

  const imageDetails = {
    credit: image.credit,
    caption: image.caption,
  };

  if (options.smartCrop && image.sizes.original) {
    // Only crop if there's an 'original' version of the image
    // Return the smart cropped image href
    return {
      href: smartCropImage(image.sizes.original, options.smartCropOptions),
      smartCrop: true,
      ...imageDetails,
    };
  }

  const bestImageSize =
    options.criteria.minWidth > options.criteria.minHeight
      ? getSizeForWidth(image.sizes, options.criteria.minWidth)
      : getSizeForHeight(image.sizes, options.criteria.minHeight);
  const candidate = getXHD(image.sizes, bestImageSize);

  if (!candidate) {
    return null;
  }

  const { _links, ...rest } = candidate;
  return {
    href: candidate.href || _links.file.href,
    ...rest,
    ...imageDetails,
    smartCrop: false,
  };
};



// WEBPACK FOOTER //
// ./src/js/app/selectors/itemImage.js