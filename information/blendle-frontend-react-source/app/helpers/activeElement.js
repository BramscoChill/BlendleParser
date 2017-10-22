/** document.activeElement can be null in IE **/

export function blurActiveElement() {
  if (document.activeElement) {
    document.activeElement.blur();
  }
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/activeElement.js