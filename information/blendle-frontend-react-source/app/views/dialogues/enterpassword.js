module.exports = (function () {
  const ByeBye = require('byebye');
  const enterPasswordView = require('views/forms/enterpassword');
  const resetTokenView = require('views/forms/resettoken');

  const EnterPasswordDialogueView = ByeBye.View.extend({
    className: 'enter-password pane',

    /**
     * Show reset password form
     */
    _showReset() {
      const self = this;
      self.showReset = true;
      self.render();
    },

    /**
     * Hide reset password form
     */
    _hideReset() {
      const self = this;
      self.showReset = false;
      self.render();
    },

    render() {
      const self = this;
      const options = self.options || {};
      let view;

      if (!self.showReset) {
        options.requestReset = this._showReset.bind(this);
        view = new enterPasswordView(options);
      } else {
        options.back = this._hideReset.bind(this);
        view = new resetTokenView(options);
      }

      this.addView(view, 'main');
      this.el.appendChild(this.getView('main').render().el);
      this.display();

      return this;
    },

    unload() {
      ByeBye.View.prototype.unload.apply(this, arguments);
    },
  });

  return EnterPasswordDialogueView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/dialogues/enterpassword.js