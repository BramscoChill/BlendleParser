import TypedError from 'helpers/typederror';
import _ from 'lodash';

function extractFontFamily(nodeStyle) {
  const fontFamily = nodeStyle.getPropertyValue('font-family').replace(/'|"/g, '');
  if (fontFamily.indexOf(',') > -1) {
    return fontFamily.substring(0, fontFamily.indexOf(','));
  }
  return fontFamily;
}

function extractFontWeight(nodeStyle) {
  const fontWeight = nodeStyle.getPropertyValue('font-weight');
  if (!isNaN(fontWeight)) {
    return fontWeight;
  }
  switch (fontWeight) {
    case 'bold':
      return 700;
    case 'normal':
      return 400;
    default:
      return undefined;
  }
}

function extractFontStyle(nodeStyle) {
  return nodeStyle.getPropertyValue('font-style') || 'normal';
}

/**
 * Extract fonts from an node and its child nodes
 * @param  {Node} node
 * @param  {Object} [fonts]
 * @return {Object}
 */
function extractFont(node) {
  const children = _.map(node.children, (childNode) => {
    const nodeStyle = window.getComputedStyle(childNode);
    return {
      family: extractFontFamily(nodeStyle),
      weight: extractFontWeight(nodeStyle),
      style: extractFontStyle(nodeStyle),
    };
  });
  return _.uniq(children, font => JSON.stringify(font));
}

/**
 * Load an array of fonts
 * @param {Array} fonts
 * @param {Number} [timeout=3000]
 * @return {Promise}
 */
export function load(fonts, timeout = 3000) {
  if (process.env.BUILD_ENV === 'test') {
    return Promise.resolve(fonts);
  }

  const observers = fonts.map(font =>
    new window.FontFaceObserver(font.family, font).load(null, timeout),
  );

  return Promise.all(observers).catch(() => {}); // Don't throw errors when fonts could not be loaded in time
}

/**
 * Extract fonts from an node and its children and load them.
 * @param  {Node} node
 * @param {Number} [timeout]
 * @return {Promise}
 */
export function loadFromElement(node, timeout) {
  return load(extractFont(node), timeout);
}

export function getElementsWithFonts(node, fonts) {
  return _.filter(node.children, (childNode) => {
    const nodeStyle = window.getComputedStyle(childNode);
    return _.where(fonts, {
      family: extractFontFamily(nodeStyle),
      weight: extractFontWeight(nodeStyle),
      style: extractFontStyle(nodeStyle),
    }).length;
  });
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/fonts.js