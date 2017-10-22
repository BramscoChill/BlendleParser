/**
 * Removes all childNodes inside the given node.
 * Used to clear a node, without losing all references to childNodes.
 * This is default behavior of .innerHTML = '' in Webkit and Firefox, but not in IE.
 * IE clears also all references, which causes React (in our use case) to fail.
 * @param {Node} node
 */
module.exports = function (node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/removeChildNodes.js