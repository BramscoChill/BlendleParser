module.exports = (function () {
  const _ = require('lodash');
  const Backbone = require('backbone');
  const Q = require('q');
  const TypedError = require('helpers/typederror');
  const transform = require('helpers/transform');
  const constants = require('app-constants');

  // ByeBye.Collection
  //
  // Adds progress support to Backbone Collections.
  const Collection = Backbone.Collection.extend({
    constructor(models, options) {
      _.extend(
        this,
        _.defaults({
          options: {},
          mappings: {},
          _links: {},
          _embedded: {},
        }),
      );

      this.options = options || this.options;

      this.url = this.options.url;
      this.link = this.options.link;
      this._track = this.options.track;

      Backbone.Collection.apply(this, arguments);
    },

    _prepareModel(attrs, options) {
      if (attrs instanceof Collection.prototype.model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.extend({}, options) : {};
      options.collection = this;

      if (this._track) {
        options.track = true;
      }

      const model = new this.model(attrs, options);

      if (!model.validationError) return model;

      this.trigger('invalid', this, model.validationError, options);

      return false;
    },
    remove(models) {
      if (models && this._track) {
        if (_.isArray(models)) {
          this._untrackModels(models);
        } else {
          models.untrack();
        }
      }

      return Backbone.Collection.prototype.remove.apply(this, arguments);
    },
    parse(resp) {
      this.setupUrlLinks(resp);

      return this._extractVariableFromResponse(resp, this.collectionKeyString);
    },
    setupUrlLinks(resp) {
      if (resp._links && resp._links.next) {
        this.next = resp._links.next.href;
      } else {
        this.next = undefined;
      }

      if (resp._links && resp._links.prev) {
        this.prev = resp._links.prev.href;
      } else {
        this.prev = undefined;
      }
    },
    _extractVariableFromResponse(resp, keyString) {
      return this.getDataByKeyString(resp, keyString);
    },
    getDataByKeyString(json, keyString) {
      if (!keyString) return json;

      let keys = keyString.split('.'),
        dataRoot = json;

      for (const i in keys) {
        const key = keys[i];

        if (dataRoot) {
          dataRoot = dataRoot[key];
        } else {
          dataRoot = undefined;

          return dataRoot;
        }
      }

      return dataRoot;
    },
    progress(e) {
      this.trigger('progress', e.loaded / e.total);
    },
    hasNext() {
      return !!this.next;
    },
    hasPrevious() {
      return !!this.prev;
    },
    fetchNext() {
      return this._fetchMore(this.next);
    },
    fetchPrevious() {
      const done = Q.defer();

      if (this.prev) {
        this._fetchMore(this.prev).then(done.resolve, done.reject);
      } else {
        done.reject(new Error('Unable to fetch previous'));
      }

      return done.promise;
    },
    _fetchMore(url) {
      const self = this,
        done = Q.defer();

      if (!this.lazyloading) {
        this.lazyloading = true;

        this.trigger('lazyloading');

        this.fetch({
          url,
          merge: true,
          remove: false,
          accept: this.acceptHeader,
        }).then(
          () => {
            self.lazyloading = false;

            done.resolve();
          },
          (err) => {
            done.reject(err);
          },
        );
      } else {
        done.reject(new TypedError(constants.STATUS_PENDING, 'Currently fetching data'));
      }

      return done.promise;
    },
    fetch(options) {
      const self = this;

      // Store the accept header because of API changes
      if (options && options.accept) {
        this.acceptHeader = options.accept;
      }

      if (!this._currentRequest) {
        this.once('error', () => {
          self._currentRequest = null;
          self.off('sync');
          self.off('abort');
        });

        this.once('abort', () => {
          self._currentRequest = null;
          self.off('sync');
          self.off('error');
        });

        this.once('sync', () => {
          self._currentRequest = null;
          self.off('abort');
          self.off('error');
        });

        this._currentRequest = Backbone.Collection.prototype.fetch.apply(this, arguments);
      }

      return this._currentRequest;
    },
    getCurrentRequest() {
      return this._currentRequest;
    },

    /**
     * Check if the model is currently fetching
     * @return {Boolean}
     */
    isFetching() {
      return !!this._currentRequest || this.lazyloading;
    },
    resetShuffled() {
      this.reset(this.shuffle(), { silent: true });
    },
    reset() {
      this.next = null;
      this.prev = null;
      this.lazyloading = false;

      Backbone.Collection.prototype.reset.apply(this, arguments);
    },
    track() {
      this._track = true;
    },
    untrack() {
      if (this._track) {
        this._untrackModels(this.models);
      }

      this._track = false;
    },
    _untrackModels(models) {
      _.each(models, (model) => {
        model.untrack && model.untrack();
      });
    },
    parseHal(resp) {
      let data = [];

      this.next = null;
      this.prev = null;

      if (resp._links) {
        this._links = transform(resp._links, this._parseLink.bind(this), {});
      }

      if (this.key) {
        data = this.getDataByKeyString(resp, this.key);
      }

      return data;
    },
    /**
     * Parse links takes a vlaue and key and reduces to links and embeds
     * @param  {Object} previous [description]
     * @param  {*} value
     * @param  {String} key
     * @return {Object}
     */
    _parseLink(previous, value, key) {
      const mapping = this.mappings[key];

      if (mapping) {
        if (!mapping.options) {
          mapping.options = {};
        }

        mapping.options.link = true;

        this._embedded[key] = new mapping.resource(value, mapping.options);
      }

      if (key === 'self') {
        // quick fix, should be removed when the backend solves issue #3858
        this.url = value.href || value;
      }

      if (key === 'next') {
        this.next = value.href;
      }

      if (key === 'prev') {
        this.prev = value.href;
      }

      previous[key] = value;

      return previous;
    },
    ensure() {
      const self = this,
        done = Q.defer();

      if (this.link) {
        this.fetch().then(() => {
          done.resolve(self);
        });
      } else {
        done.resolve(this);
      }

      return done.promise;
    },
  });

  return Collection;
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/collection.js