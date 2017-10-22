module.exports = (function () {
  // Libraries
  const Backbone = require('backbone');
  const _ = require('lodash');

  // Mixins
  const LoadUnloadMixin = require('./mixins/loadunload');
  const EventListenerMixin = require('./mixins/eventlistener');
  const StateMixin = require('./mixins/state');
  const LayoutMixin = require('./mixins/layout');
  const DomHelpersMixin = require('./mixins/domhelpers');

  // ByeBye.View
  //
  // Adds states, load/unloadMethods and event propagation to Backbone Views.

  // Constructor
  const View = Backbone.View.extend({
    constructor(options) {
      _.extend(
        this,
        _.defaults(this, {
          loaded: false,
          sleeping: false,
          dom: {},
          options: {},
          _views: {},
          _states: {},
          _children: [],
          _variablesSetup: true,
          _globalEvents: [],
        }),
      );

      this.options = options || this.options;

      this.analytics = this.options.analytics || {};

      if (this.defaultClassName) {
        this.className = `${this.defaultClassName} ${this.className}`;
      }

      Backbone.View.apply(this, arguments);
    },
  });

  // Class functions, mixed in with LoadUnload
  _.extend(
    View.prototype,
    EventListenerMixin,
    LoadUnloadMixin,
    StateMixin,
    LayoutMixin,
    DomHelpersMixin,
    {
      applyDefaultEvents(defaultEvents) {
        this.events = this.events || {};

        defaultEvents = defaultEvents || this.defaultEvents;

        for (const e in defaultEvents) {
          if (!this.events[e] && defaultEvents.hasOwnProperty(e)) {
            this.events[e] = defaultEvents[e];
          }
        }
      },

      // Dummy functions
      close() {},
      render() {
        return this;
      },
      afterRender() {},

      _eStopPropagation(e) {
        e.stopPropagation();
      },
      setOptions(options) {
        // Override currently set options by key
        for (const k in options) {
          this.options[k] = options[k];
        }
      },
      setController(controller) {
        this._controller = controller;

        return controller;
      },
      getController() {
        return this._controller;
      },
      getRootView() {
        return this._rootView;
      },
      getModule() {
        return this._controller.getModule();
      },
      loadView() {
        this.delegateEvents(this.events);

        return LoadUnloadMixin.load.apply(this, arguments);
      },
      unloadView() {
        return LoadUnloadMixin.unload.apply(this, arguments);
      },
      afterUnload() {
        this.removeAllEventListeners();

        this._controller = null;
        this._rootView = null;

        this.remove();

        delete this.dom;
        delete this.el;
        delete this.options;
        delete this.model;
        delete this.collection;
        delete this._children;
        delete this._controller;
        delete this._rootView;
      },
      afterSleep() {
        this.removeAllEventListeners();
      },
      removeView(view) {
        this.stopPropagation(view);

        return LoadUnloadMixin.removeView.apply(this, arguments);
      },
      addView(view) {
        this.propagateEvents(view);

        if (this.getController()) {
          view.setController(this.getController());
          view._rootView = this.getController().getRootView();
        }

        return LoadUnloadMixin.addView.apply(this, arguments);
      },
      renderViews(roles, rootElement) {
        if (!rootElement) {
          rootElement = this.el;
        }

        _.each(this.getViews(roles), (view) => {
          rootElement.appendChild(view.render().el);
          view.afterRender();
        });
      },
      hide() {
        this.setState('hidden');
      },
      display() {
        this.delegateEvents(this.events);

        this.setState('success');
      },
      getOffset() {
        const box = this.el.getBoundingClientRect();

        return {
          top: box.top + window.pageYOffset - this.el.ownerDocument.documentElement.clientTop,
          left: box.left + window.pageXOffset - this.el.ownerDocument.documentElement.clientLeft,
        };
      },
      renderViewOn(selector, view) {
        view.setElement(this.el.querySelector(selector));
        view.render();
      },
      setupDomLinks(object) {
        const domLinks = {};
        for (const k in object) {
          if (typeof object[k] === 'object') {
            domLinks[k] = this.setupDomLinks(object[k]);
          } else {
            domLinks[k] = this.el.querySelector(object[k]);
          }
        }

        this.dom = domLinks;

        return domLinks;
      },
    },
  );

  return View;
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/view.js