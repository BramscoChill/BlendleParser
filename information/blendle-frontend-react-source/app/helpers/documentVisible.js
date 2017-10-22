module.exports = function () {
  if (typeof document.hidden !== 'undefined') {
    return !document.hidden;
  } else if (typeof document.webkitHidden !== 'undefined') {
    return !document.webkitHidden;
  }
  return true;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/documentVisible.js