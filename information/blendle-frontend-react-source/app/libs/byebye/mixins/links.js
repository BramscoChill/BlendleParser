module.exports = (function () {
  const _ = require('lodash');

  const URI = require('urijs');
  const URITemplate = require('urijs/src/URITemplate');

  const LinkMixin = {
    getLink(key, values, options) {
      if (!this._links[key]) {
        return undefined;
      }

      return URI(URITemplate(this._links[key].href).expand(values))
        .addSearch(this._getSearchOptions(options))
        .toString();
    },
    getLinkAttribute(key, attribute) {
      return this._links[key][attribute];
    },
    setLink(key, value) {
      this._links[key] = value;
    },
    setLinks(links) {
      _.extend(this._links, links);
    },

    _getSearchOptions(options) {
      let search = {};

      if (_.isArray(options)) {
        search.zoom = options.join(',');
      } else if (_.isObject(options)) {
        search = options;

        if (_.isArray(options.zoom)) {
          search.zoom = options.zoom.join(',');
        }
      }

      return search;
    },
  };

  return LinkMixin;
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/mixins/links.js