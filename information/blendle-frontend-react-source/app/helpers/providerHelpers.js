import { providerTemplate, prefillSelector } from 'selectors/providers';
const portraitTileRegex = /\s\{content}/g;

export function getDefaultTileTemplate(providerId) {
  return prefillSelector(providerTemplate)(providerId, 'tile');
}

export function getPortraitTileTemplate(providerId) {
  return getDefaultTileTemplate(providerId).replace(portraitTileRegex, '');
}

export function getProviderLogoUrl(providerId, file) {
  return `https://provider-assets.blendlecdn.com/images/providers/${providerId}/${file}`;
}

export function getWhiteProviderLogoUrl(providerId) {
  return getProviderLogoUrl(providerId, 'provider-w-crop.png');
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/providerHelpers.js