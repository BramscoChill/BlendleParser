import prefixProp from 'prefix-style';

export default (style) => {
  const prefixedStyle = style;

  Object.keys(style).forEach((prop) => {
    const prefixedProp = prefixProp(prop);

    if (prefixedProp) {
      prefixedStyle[prefixedProp] = style[prop];
    }
  });

  return prefixedStyle;
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/prefixedStyle.js