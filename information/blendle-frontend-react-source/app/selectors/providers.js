import ProviderStore from 'stores/ProviderStore';
import { memoize } from 'lodash';

const getProviderOrDefault = memoize(
  ({ state, providerId }) =>
    state.providers.find(provider => provider.id === providerId) || state.defaultProvider,
  ({ providerId }) => providerId,
);

function hasCapability(state, providerId, capability, defaultValue = false) {
  const provider = getProviderOrDefault({ state, providerId });
  if (provider.capabilities && provider.capabilities.hasOwnProperty(capability)) {
    return provider.capabilities[capability];
  }

  window.ErrorLogger.captureMessage(`${provider.id} does not contain the capability ${capability}`);

  return defaultValue;
}

export const providerById = (state, providerId) => getProviderOrDefault({ state, providerId });
export const allProviders = state => state.providers;
export const providerNames = state =>
  state.providers.map(provider => provider.name).filter(name => !!name);
export const providerTemplate = (state, providerId, templateName) => {
  const provider = getProviderOrDefault({ state, providerId });
  return provider.templates[templateName];
};

export const isProviderHidden = (state, providerId) =>
  hasCapability(state, providerId, 'hide_issue', false);

export const isProviderPortraitImageCapable = (state, providerId) =>
  hasCapability(state, providerId, 'portrait_tile_image', false);

export const providerImagesExpire = (state, providerId) =>
  hasCapability(state, providerId, 'images_expire', false);

export const isProviderWithoutImages = (state, providerId) =>
  hasCapability(state, providerId, 'hide_images', false);

export const providerHasFullScreenImages = (state, providerId) =>
  hasCapability(state, providerId, 'fullscreen_images', true);

export const providerHasImageGrid = (state, providerId) =>
  hasCapability(state, providerId, 'image_grid', true);

export const providerHasStreamers = (state, providerId) =>
  hasCapability(state, providerId, 'streamers', false);

export const prefillSelector = fn => fn.bind(null, ProviderStore.getState());



// WEBPACK FOOTER //
// ./src/js/app/selectors/providers.js