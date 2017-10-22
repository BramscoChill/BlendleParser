module.exports = (function () {
  const Backbone = require('backbone');
  const Settings = require('controllers/settings');
  const stringToBool = require('helpers/stringtobool');

  const PreferencesManager = {
    save(user, preferences) {
      // the services returns boolean values as a string,
      // but doesn't accept a boolean as a string on save.
      for (const key in preferences) {
        preferences[key] = stringToBool(preferences[key]);
      }

      return Backbone.ajax({
        url: Settings.getLink('preferences', { user_id: user.id }),
        type: 'PUT',
        data: JSON.stringify(preferences),
      });
    },
  };

  return PreferencesManager;
}());



// WEBPACK FOOTER //
// ./src/js/app/managers/preferences.js