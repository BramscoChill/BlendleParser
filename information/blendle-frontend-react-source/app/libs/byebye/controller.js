module.exports = (function () {
  const _ = require('lodash'),
    EventListenerMixin = require('./mixins/eventlistener'),
    Backbone = require('backbone');

  const Controller = function (options) {
    _.extend(
      this,
      _.defaults(this, {
        options: {},
        controllers: [],
        model: {},
      }),
    );

    this.options = options || this.options;
    this.model = options.model || {};

    if (this.initialize) {
      this.initialize.apply(this, arguments);
    }
  };

  Controller.extend = Backbone.Model.extend;
  _.extend(Controller.prototype, EventListenerMixin, Backbone.Events);

  return Controller;
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/controller.js