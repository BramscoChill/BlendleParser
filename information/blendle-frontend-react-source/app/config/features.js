import { getItem } from 'helpers/localStorage';

const onlyDev = process.env.BUILD_ENV === 'development' || process.env.BUILD_ENV === 'local';
const onlyProd = process.env.BUILD_ENV === 'production';
const onlyTest = process.env.BUILD_ENV === 'test';
const onlyApproval = process.env.BUILD_ENV === 'approval';
const excludeProd = process.env.BUILD_ENV !== 'production';
const excludeTest = process.env.BUILD_ENV !== 'test';
const excludeApproval = process.env.BUILD_ENV !== 'approval';

window.__BUILD_ENV = process.env.BUILD_ENV;

export default {
  accesspage: true,

  // Track performance metrics to MixPepple
  trackPerformance: true,

  // Only use adwords for production
  adwords: onlyProd,

  // Imagegrids in the reader
  imageGrid: true,

  // portrait image manifests in timeline
  portraitImageManifest: true,

  // show subitems in a item, this is a next-gen reader feature.
  subItems: true,

  showBetaAsReleased: onlyApproval,
  showAlphaCountries: excludeProd && excludeTest,

  // Smart cropped images in tiles and reader
  smartCropImages: excludeTest,

  // Show Premium to all users
  blendlePremium: true,

  // Exclude images with "original" size because they can be HUGE
  excludeOriginalImages: true,

  deeplinkPremiumSignup: true,

  readerPremiumUpsell: onlyDev || onlyTest,

  // feature gate subscriptions by ID
  subscriptions: {
    nationalgeographictraveler: excludeProd,
    glamour: excludeProd,
    vogue: excludeProd,
    pmmagazin: excludeProd,
  },

  // If we have to enable this again for whatever reason
  // We should make sure that we don't show the images when the reader
  // is rendering with only the manifest
  hideImagesAfterXDays: false,

  stripePaymentLink: onlyDev,
};



// WEBPACK FOOTER //
// ./src/js/app/config/features.js