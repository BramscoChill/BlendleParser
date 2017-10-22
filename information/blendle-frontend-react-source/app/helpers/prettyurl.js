import { getManifestBody, getContentAsText, getTitle } from 'helpers/manifest';
import { prefillSelector, providerById } from 'selectors/providers';
import slugify from 'helpers/slugify';

export function createItemUri(manifest) {
  const manifestBody = getManifestBody(manifest);
  // Support backbone model and pojo
  const providerId = manifest.get ? manifest.get('provider').id : manifest.provider.id;
  const provider = prefillSelector(providerById)(providerId);

  return [
    'i',
    slugify(provider.name),
    slugify(getContentAsText(getTitle(manifestBody))),
    manifest.id,
  ].join('/');
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/prettyurl.js