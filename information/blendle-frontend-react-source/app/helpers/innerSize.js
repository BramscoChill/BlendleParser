const toInt = x => parseInt(x, 10);

export function innerHeight(node) {
  const style = getComputedStyle(node);
  return node.offsetHeight - toInt(style.paddingTop) - toInt(style.paddingBottom);
}

export function innerWidth(node) {
  const style = getComputedStyle(node);
  return node.offsetWidth - toInt(style.paddingLeft) - toInt(style.paddingRight);
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/innerSize.js