function itemType(metadata, type) {
  const elements = metadata.elements || [];
  const intro = elements.find(element => element.type === type);

  return intro ? intro.content : null;
}

export const itemHeadline = metaData => itemType(metaData, 'hl1');
export const itemIntro = metadata => itemType(metadata, 'intro');



// WEBPACK FOOTER //
// ./src/js/app/selectors/itemMetadata.js