module.exports = (function () {
  // Libraries
  const ByeBye = require('byebye');
  const Backbone = require('backbone');
  const _ = require('lodash');

  // Helpers
  const parseHal = require('helpers/parsehal');

  /**
   * TODO: Get rid of parseHal and implement this.parseHal();
   */

  const SettingsController = Backbone.Model.extend({
    parse(resp) {
      this._links = resp._links;

      return parseHal(resp, {
        publications: { model: Publications },
        provider_categories: { model: ProviderCategories },
      });
    },

    fetch(...args) {
      if (this._settingsFetched) {
        return Promise.resolve(this);
      }

      // Make sure we always have options with determineRetryTimeout
      args[0] = args[0] || {};
      if (!args[0].determineRetryTimeout) {
        args[0].determineRetryTimeout = this._determineRetryTimeout.bind(this);
      }

      return Backbone.Model.prototype.fetch.apply(this, args).then(() => {
        this._settingsFetched = true;
        return Promise.resolve(this);
      });
    },

    settingsFetched() {
      return this._settingsFetched;
    },

    _determineRetryTimeout(err, retries) {
      return err.status === 503 && retries <= 1 ? 1000 : false;
    },
  });

  _.extend(SettingsController.prototype, ByeBye.Mixins.Links);

  const Publications = Backbone.Model.extend({
    parse(resp) {
      return parseHal(resp);
    },
  });

  const ProviderCategories = Backbone.Model.extend({
    parse(resp) {
      return parseHal(resp);
    },
  });

  const Settings = new SettingsController();

  return Settings;
}());



// WEBPACK FOOTER //
// ./src/js/app/controllers/settings.js