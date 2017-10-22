import Environment from 'environment';

export default function (itemId) {
  let suffix = '';
  if (['approval', 'development'].includes(Environment.name)) {
    suffix = '-staging';
  }
  // This could be moved to an environment specific api.json
  // when removed from labs.
  return `https://editor-v2${suffix}.blendle.io/item/${itemId}`;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/getEditorUrl.js