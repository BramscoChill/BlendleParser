import { arrayOf } from 'prop-types';

export const largePadding = Symbol('largePadding');
export const featuredProviderLogo = Symbol('featuredProviderLogo');
export const mediumProviderLogo = Symbol('mediumProviderLogo');
export const sharpCorners = Symbol('sharpCorners');
export const bottomLeftGradient = Symbol('bottomLeftGradient');
export const showIntroText = Symbol('showIntroText');
export const noHoverEffect = Symbol('noHoverEffect');
export const parallaxScrolling = Symbol('parallaxScrolling');

const features = [
  largePadding,
  featuredProviderLogo,
  mediumProviderLogo,
  sharpCorners,
  bottomLeftGradient,
  showIntroText,
  noHoverEffect,
  parallaxScrolling,
];

export const featuresPropType = arrayOf((propValue, key, componentName, location, propFullName) => {
  if (!features.includes(propValue[key])) {
    throw Error(
      `Invalid prop '${propFullName}' (${propValue[key]}) supplied to '${componentName}'.`,
    );
  }
});



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/features.js