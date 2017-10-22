module.exports = (function () {
  const _ = require('lodash'),
    Mousewheel = require('helpers/mousewheel');

  const EventListenerMixin = {
    addEventListener(node, event, callback) {
      if (!this._globalEvents) {
        this._globalEvents = [];
      }

      const listener = {
        node,
        event,
        callback,
      };

      this._globalEvents.push(listener);

      // Automatically add normalized mousewheel events instead of normal events
      if (event === 'mousewheel') {
        Mousewheel.addEventListener(node, callback);
      } else {
        node.addEventListener(event, callback);
      }

      return listener;
    },
    addEventListenerOnce(node, event, callback) {
      const self = this;

      const listener = this.addEventListener(node, event, (e) => {
        self._removeEventListener(listener);

        callback(e);
      });

      return listener;
    },
    removeEventListener(node, event) {
      const listener = _.find(this._globalEvents, { node, event });

      if (listener) {
        this._removeEventListener(listener);
      }
    },
    _removeEventListener(listener) {
      if (listener.event === 'mousewheel') {
        Mousewheel.removeEventListener(listener.node, listener.callback);
      } else {
        listener.node.removeEventListener(listener.event, listener.callback);
      }

      this._globalEvents.splice(this._globalEvents.indexOf(listener), 1);

      listener.node = null;
    },
    removeAllEventListeners() {
      if (this._globalEvents) {
        _.each(_.clone(this._globalEvents), this._removeEventListener.bind(this));

        this._globalEvents = null;
      }
    },
  };

  return EventListenerMixin;
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/mixins/eventlistener.js