module.exports = (function () {
  const EmailAddressManager = require('managers/emailaddress');
  const InputFormElementView = require('views/forms/elements/input');
  const InputSuggestionView = require('views/forms/helpers/inputsuggestion');
  const i18n = require('instances/i18n');

  const EmailFormElementView = InputFormElementView.extend({
    type: 'email',
    name: 'email',
    autoComplete: false,
    toLowerCase: true,
    keyUpChangeTimeout: 300,

    _eChange() {
      this.checkForCommonMistakes();
    },

    _eKeyDown(ev) {
      if (this.options.onKeyDown) {
        this.options.onKeyDown(ev);
      }
    },

    checkForCommonMistakes() {
      const suggestion = EmailAddressManager.checkForCommonMistakes(this.getValue());
      if (suggestion) {
        this.drawSuggestion(suggestion);
      } else {
        this.resetSuggestion();
      }
    },

    drawSuggestion(suggestion) {
      const self = this;

      if (!this.getView('suggestion')) {
        const view = this.addView(
          new InputSuggestionView({
            accept(suggestion) {
              // Set suggestion as value when user accepts suggestion and remove suggestion view
              self.setValue(suggestion);
              // TODO Make it so that removeView will remove its own domNode.
              self.removeView(self.getView('suggestion'));
              const suggestEl = self.el.querySelector('.v-inp-suggestion');
              if (suggestEl) {
                self.el.removeChild(suggestEl);
              }
            },
            // reject: function () {} // Reject will reset the view, which will hide it. That's enough here.
          }),
          'suggestion',
        );
        this.el.appendChild(view.render().el);
      }

      // Show suggestion
      this.getView('suggestion').suggest(
        suggestion,
        i18n.translate('app.text.did_you_mean', suggestion),
      );
    },

    resetSuggestion() {
      if (this.getView('suggestion')) {
        this.getView('suggestion').reset();
      }
    },

    reset() {
      this.resetSuggestion();

      InputFormElementView.prototype.reset.apply(this);
    },
  });

  return EmailFormElementView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/forms/elements/email.js