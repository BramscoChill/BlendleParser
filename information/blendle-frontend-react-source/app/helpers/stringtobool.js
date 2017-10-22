module.exports = (function () {
  return function stringToBool(str) {
    if (str === 'true') {
      return true;
    }
    if (str === 'false') {
      return false;
    }
    return str;
  };
}());



// WEBPACK FOOTER //
// ./src/js/app/helpers/stringtobool.js