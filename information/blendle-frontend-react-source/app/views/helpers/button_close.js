module.exports = (function () {
  // Libraries
  const ByeBye = require('byebye');

  const i18n = require('instances/i18n').locale;

  // Templates
  const closeButtonTemplate = require('templates/elements/button-close');

  const CloseButtonView = ByeBye.View.extend({
    className: 'v-close',
    events: {
      'click .btn-close': '_eCloseByClick',
    },
    render() {
      this.delegateEvents();

      this.el.innerHTML = closeButtonTemplate({
        i18n,
      });

      return this;
    },
    _eCloseByClick() {
      if (this.options.onClick) {
        this.options.onClick(this.getController());
      } else {
        this.getController().close();
      }
    },
  });

  return CloseButtonView;
}());



// WEBPACK FOOTER //
// ./src/js/app/views/helpers/button_close.js