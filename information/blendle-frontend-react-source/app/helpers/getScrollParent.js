module.exports = function getScrollParent(element) {
  let parent = element.parentNode;
  let style = window.getComputedStyle(parent);
  const regExp = /auto|scroll|scroll-x|scroll-y/;

  while (style && !regExp.test(style.overflow)) {
    parent = parent.parentNode;
    if (!(parent instanceof Element)) {
      break;
    }
    style = window.getComputedStyle(parent);
  }

  if (!parent || !style || !regExp.test(style.overflow)) {
    return window;
  }

  return parent;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/getScrollParent.js