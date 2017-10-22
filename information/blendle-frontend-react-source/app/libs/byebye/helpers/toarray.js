module.exports = (function () {
  const _ = require('lodash');
  const Collection = require('../collection');

  return function (collection) {
    if (collection instanceof Collection) return collection.toArray();

    return _.isArray(collection) ? collection : [collection];
  };
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/helpers/toarray.js