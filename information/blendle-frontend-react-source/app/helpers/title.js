module.exports = (function () {
  const _ = require('lodash');
  const stripTags = require('underscore.string/stripTags');

  const defaultTitle = 'Blendle';
  const seperator = ' - ';

  const TitleHelper = {
    _set(title) {
      document.title = _.trim(_.unescape(stripTags(title)));
    },
    reset() {
      this._set(defaultTitle);
    },
    set(input) {
      // Create array from input.
      let parts = [];
      if (input instanceof Array) {
        parts = input;
      } else {
        parts.push(input);
      }

      // append defaultTitle
      parts.push(defaultTitle);

      this._set(parts.join(seperator));
    },
  };

  return TitleHelper;
}());



// WEBPACK FOOTER //
// ./src/js/app/helpers/title.js