export function getFeaturedImage(manifest) {
  if (manifest.toJSON) {
    manifest = manifest.toJSON();
  }

  const images = manifest.images || [];

  return images.find(image => image.featured);
}

export const getProviderId = manifest => manifest.get('provider.id');



// WEBPACK FOOTER //
// ./src/js/app/selectors/manifest.js