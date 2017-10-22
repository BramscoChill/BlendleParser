module.exports = (function () {
  // Libraries
  const _ = require('lodash');
  const ByeBye = require('byebye');

  const i18n = require('instances/i18n').locale;

  // Templates
  const template = require('templates/forms/helpers/suggestion');

  const InputSuggestionView = ByeBye.View.extend({
    className: 'v-inp-suggestion',

    events: {
      click: '_eAccept',
    },

    _currentSuggestion: null,

    suggest(suggestion, message) {
      if (this._currentSuggestion === suggestion) {
        return false;
      }

      this._currentSuggestion = suggestion;
      this.dom.message.innerHTML = message || suggestion;

      this.setState('open');
    },

    reset() {
      this._currentSuggestion = null;
      this.dom.message.innerHTML = '';

      this.resetState();
    },

    getSuggestion() {
      return this._currentSuggestion;
    },

    _eAccept() {
      if (_.isFunction(this.options.accept)) {
        this.options.accept(this.getSuggestion());
      }

      this.reset();
    },

    render() {
      this.el.innerHTML = template({
        i18n,
        message: this.options.message,
      });

      this.dom = {
        message: this.el.querySelector('.message'),
      };

      return this;
    },
  });

  return InputSuggestionView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/forms/helpers/inputsuggestion.js