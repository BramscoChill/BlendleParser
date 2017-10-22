import React from 'react';
import { getLargestVariant } from 'helpers/optimalImage';
import { getManifestBody, getTitle, getIntro, getContentAsText } from 'helpers/manifest';
import { getFeaturedImage } from 'selectors/manifest';

function getImage(item) {
  const image = getFeaturedImage(item.getEmbedded('manifest'));

  if (image) {
    const imageObject = getLargestVariant(image._links);

    return {
      image: {
        '@type': 'ImageObject',
        url: imageObject.href,
        width: imageObject.width,
        height: imageObject.height,
      },
    };
  }

  return undefined;
}

function getSchemaObject(item) {
  const manifest = item.get('manifest');
  const manifestBody = getManifestBody(manifest);

  return {
    '@context': 'http://schema.org',
    '@type': 'NewsArticle',
    headline: getContentAsText(getTitle(manifestBody)),
    ...getImage(item),
    datePublished: manifest.get('date'),
    description: getContentAsText(getIntro(manifestBody)),
  };
}

export default function DeeplinkJSONLD({ item }) {
  const schema = JSON.stringify(getSchemaObject(item));
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />;
}



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/components/DeeplinkJSONLD.js