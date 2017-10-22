module.exports = (function () {
  /**
   * Transform is like reduce but takes an object instead of an array
   * @param  {Object}   object
   * @param  {Function} cb
   * @param  {*}      [initialValue]
   * @return {Object}
   */
  function transform(object, cb, initialValue) {
    return Object.keys(object).reduce((previous, key) => {
      const value = object[key];

      return cb(previous, value, key);
    }, initialValue);
  }

  return transform;
}());



// WEBPACK FOOTER //
// ./src/js/app/helpers/transform.js