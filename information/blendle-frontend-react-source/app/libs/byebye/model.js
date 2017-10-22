module.exports = (function () {
  const _ = require('lodash'),
    Q = require('q'),
    Backbone = require('backbone'),
    ModelCache = require('./modelcache'),
    LinkMixin = require('./mixins/links'),
    transform = require('helpers/transform'),
    documentVisible = require('helpers/documentVisible');

  // ByeBye.Model
  //
  // Adds validation to Backbone Models
  const Model = Backbone.Model.extend({
    _pollingInterval: 10000,
    expressions: {}, // Key/value => key/regex for input validation
    validStates: {}, // Hold key/bool representing validation state per key
    required: {}, // Hold key/bool for required fields. Unrequired empty fields won't be validated.
    name: 'model',
    mappings: {},
    defaultMapping: { resource: Backbone.Model, options: {} },
    // Validation
    constructor(attributes, options) {
      let cachedModel;

      this.options = options;
      this.link = options && options.link;

      this._embedded = {};
      this._links = {};

      if (options && options.url) {
        this.url = options.url;
      }

      if (
        attributes &&
        attributes.id === undefined &&
        attributes._links &&
        attributes._links.self
      ) {
        attributes.id = attributes._links.self.href;
      }

      // Model tracking
      // if tracking is enabled, use a cached version of the model
      // if available, else, use new version of the model
      if (options && options.track && attributes && attributes.id) {
        cachedModel = ModelCache.get(this.name, attributes.id);

        if (cachedModel) {
          cachedModel.track();

          cachedModel.set(cachedModel.parse(attributes));

          _.each(cachedModel.attributes, (attribute) => {
            if (_.isObject(attribute) && attribute._modelCacheReferences) {
              attribute.track();
            }
          });

          return cachedModel;
        }

        this.track();

        ModelCache.set(this.name, attributes.id, this);
      }

      Backbone.Model.apply(this, arguments);
    },
    waitFor(attribute) {
      const self = this,
        done = Q.defer();

      if ((attribute && !this.get(attribute)) || this.isNew()) {
        this.once('sync', () => {
          done.resolve(self);
        });
      } else {
        done.resolve(this);
      }

      return done.promise;
    },
    // returns a list of errors, or false when there were no errors.
    validate(attributes) {
      let errors = [],
        _attributes = {},
        attr;

      // We could be given no attributes, in which case get the keys from expressions list.
      // We could be given an array of attributes to check. Combine with values into an object.
      // Otherwise just run the given object through validation.
      if (!attributes) {
        // Get all values
        for (attr in this.expressions) {
          _attributes[attr] = this.get(attr);
        }
      } else if (attributes instanceof Array) {
        for (const i in attributes) {
          _attributes[attributes[i]] = this.get(attributes[i]);
        }
      } else {
        _attributes = attributes;
      }

      for (attr in _attributes) {
        const value = _attributes[attr];
        // Unrequired fields don't need a value. Otherwise check them.
        if (
          (!this.required[attr] && (value === null || value === undefined || !value.length)) ||
          !this.expressions[attr] ||
          this.expressions[attr].test(value)
        ) {
          this.validStates[attr] = true;
        } else {
          this.validStates[attr] = false;
          errors.push(attr);
        }
      }

      return errors.length > 0 ? errors : false;
    },
    setupUrlLinks(resp) {
      if (resp && resp._links) {
        if (resp._links.next) {
          this.next = resp._links.next.href;

          delete resp._links.next;
        } else {
          this.next = undefined;
        }

        if (resp._links.prev) {
          this.prev = resp._links.prev.href;

          delete resp._links.prev;
        } else {
          this.prev = undefined;
        }

        if (resp._links.self) {
          this.url = resp._links.self.href.replace(/\?.*?$/, '');

          delete resp._links.self;
        }
      }
    },
    // Check if give list (or everything) is valid.
    isValid(attributes) {
      if (this.validate(attributes)) {
        return false;
      }

      return true;
    },

    // Return a list of invalid attributes.
    invalidAttributes() {
      const self = this;

      const keys = Object.keys(this.validStates).filter(key => self.validStates[key] === false);

      return keys;
    },
    setPollingInterval(interval) {
      if (this.isPolling()) {
        this.poll(interval);
      }

      this._pollingInterval = interval;
    },
    poll(interval, onResolve, onReject) {
      if (!onReject) {
        onReject = function (err) {
          if (!err.xhr) return Promise.reject(err);
        };
      }

      this.stopPolling();

      this.fetch({ merge: true }).then(onResolve, onReject);

      this._pollingId = setInterval(() => {
        if (!documentVisible()) {
          return;
        }
        this.trigger('poll', this);
        this.fetch({ merge: true }).then(onResolve, onReject);
      }, interval || this._pollingInterval);
    },
    isPolling() {
      return !!this._pollingId;
    },
    stopPolling() {
      clearInterval(this._pollingId);

      this._pollingId = null;
    },
    fetch(options) {
      const self = this,
        force = options && options.force;

      if (force || !this._currentRequest) {
        this.once('abort', () => {
          self._currentRequest = null;
          self.off('sync');
        });

        this.once('sync', () => {
          self._currentRequest = null;
          self.off('abort');
        });

        this._currentRequest = Backbone.Model.prototype.fetch.apply(this, arguments);
      }

      return this._currentRequest;
    },
    abort() {
      if (this._currentRequest) {
        this._currentRequest.abort();
        this._currentRequest = null;
      }
    },
    getCurrentRequest() {
      return this._currentRequest;
    },

    /**
     * Check if the model is currently fetching
     * @return {Boolean}
     */
    isFetching() {
      return !!this._currentRequest;
    },

    // Track
    track() {
      // Initiate tracking
      if (!this._modelCacheReferences) {
        this._modelCacheReferences = 0;
      }

      return this._modelCacheReferences++;
    },
    // Untrack
    untrack() {
      // If model cache references, lower it
      if (this._modelCacheReferences) {
        // Remove reference
        this._modelCacheReferences--;

        // Amount of references is zero or lower, remove from cache
        if (this._modelCacheReferences <= 0) {
          ModelCache.remove(this.name, this.id);
        }
      }

      // Untrack child models
      _.each(this.attributes, (attribute) => {
        if (_.isArray(attribute)) {
          _.each(attribute, this.untrackAttribute.bind(this));
        } else {
          this.untrackAttribute(attribute);
        }

        attribute = null;
      });

      return this._modelCacheReferences;
    },
    untrackAttribute(attribute) {
      if (_.isObject(attribute) && attribute._modelCacheReferences) {
        attribute.untrack();
      }
    },

    /**
     * Default parser
     */
    parse(resp) {
      return this.parseHal(resp);
    },

    /**
     * ParseHAL iterates over a JSON string and returns
     * a parsed string. ParseHAL creates new objects
     * based on mappings for both links and embeds and
     * removes embedded resource.
     *
     * @param  {JSON} resp
     * @return {JSON}
     */
    parseHal(resp) {
      const self = this;

      return transform(
        resp,
        (previous, value, key) => {
          if (key === '_links') {
            previous.links = transform(value, self._parseLink.bind(self), {});

            // Backwards compatibility
            return previous;
          }

          if (key === '_embedded') {
            value = transform(value, self._parseEmbed.bind(self), {});

            // Backwards compatibility
            for (const index in value) {
              if (value.hasOwnProperty(index)) {
                previous[index] = value[index];
              }
            }

            return previous;
          }

          previous[key] = value;

          return previous;
        },
        {},
      );
    },

    /**
     * parseEmbed takes a value and key and reduces it to
     * models
     * @param {Object} previous
     * @param {*} value
     * @param {String} key
     * @return {Object}
     */
    _parseEmbed(previous, value, key) {
      previous[key] = this.setEmbedded(key, value);

      return previous;
    },

    /**
     * Parse links takes a vlaue and key and reduces to links and embeds
     * @param {Object} previous [description]
     * @param {*} value
     * @param {String} key
     * @return {Object}
     */
    _parseLink(previous, value, key) {
      this._links[key] = value;

      if (key === 'self') {
        this.url = value.href;
      }

      previous[key] = value;

      return previous;
    },

    setEmbedded(key, value, options) {
      options = _.defaults(options || {}, { parse: true });

      if (options.parse) {
        const mapping = this.getMapping(key);

        mapping.options = _.defaults(mapping.options || {}, {
          parse: true,
          track: true,
        });

        this._embedded[key] = new mapping.resource(value, mapping.options);
      } else {
        this._embedded[key] = value;
      }

      return this.getEmbedded(key);
    },

    getEmbedded(key) {
      if (!key) return this._embedded; // Default, return all embedded

      if (this._embedded[key]) {
        return this._embedded[key];
      }

      return null;
    },
    fetchRelation(key, options) {
      const self = this;
      const url = this.getLink(key, options);

      if (!url) {
        throw new Error(`Unable to fetch relation, no such key ${key}`);
      }

      const ajaxOptions = {
        url,
        accept: options && options.accept,
      };

      // If we are requesting a relation which starts with b:, we're fetching a new version of the api
      if (key.indexOf('b:') === 0) {
        ajaxOptions.accept = 'application/hal+json';
      }

      return Backbone.ajax(ajaxOptions).then(resp =>
        Promise.resolve(self.setEmbedded(key, resp.data)),
      );
    },
    getRelation(key, options) {
      const embed = this.getEmbedded(key);

      if (embed) {
        return Promise.resolve(embed);
      }
      return this.fetchRelation(key, options);
    },
    getMapping(key) {
      return this.mappings[key] || this.defaultMapping;
    },
    /**
     * Ensure model is not a link before returning data
     * @return {Promise}
     */
    ensure() {
      const self = this,
        done = Q.defer();

      if (this.link) {
        this.fetch().then(() => {
          self.link = false;

          done.resolve(self);
        });
      } else {
        done.resolve(this);
      }

      return done.promise;
    },
  });

  _.extend(Model.prototype, LinkMixin);

  return Model;
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/model.js