module.exports = (function () {
  const matchesSelector = function (node, selector) {
    const matchesSelectorMethod =
      node.matches ||
      node.matchesSelector ||
      node.mozMatchesSelector ||
      node.msMatchesSelector ||
      node.oMatchesSelector ||
      node.webkitMatchesSelector;

    if (matchesSelectorMethod) {
      return matchesSelectorMethod.call(node, selector);
    }
  };

  function getSelfOrParent(node, find) {
    const findSelector = typeof find === 'string';

    while (node) {
      if ((findSelector && matchesSelector(node, find)) || node === find) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  return getSelfOrParent;
}());



// WEBPACK FOOTER //
// ./src/js/app/helpers/getselforparent.js