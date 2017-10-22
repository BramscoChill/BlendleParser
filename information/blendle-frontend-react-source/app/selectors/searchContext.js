export function getSnippet(tiles, itemId) {
  return tiles.get(itemId)['search-context'].snippet;
}

export function getTerm(tiles, itemId) {
  return tiles.get(itemId)['search-context'].term;
}



// WEBPACK FOOTER //
// ./src/js/app/selectors/searchContext.js