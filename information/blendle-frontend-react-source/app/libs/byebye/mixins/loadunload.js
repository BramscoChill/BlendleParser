module.exports = (function () {
  // Libraries
  const _ = require('lodash');
  return {
    // Executing call stacks for after, before and children
    _executeMethodStack(identifier) {
      const beforeFunctionPointer = this[`before${_.capitalize(identifier)}`],
        afterFunctionPointer = this[`after${_.capitalize(identifier)}`];

      beforeFunctionPointer.call(this);

      this._executeChildMethods(identifier);

      afterFunctionPointer.call(this);
    },
    _executeChildMethods(identifier) {
      for (let i = 0; i < this._children.length; i++) {
        const object = this._children[i].object;

        object[identifier].call(object);
      }
    },
    _encapsulateObject(type, object, role) {
      return {
        type,
        object,
        role,
      };
    },

    // Accessing children
    addChild(type, object, role) {
      if (role) {
        this.removeChildOfRole(type, role);
      }

      this._children.push(this._encapsulateObject(type, object, role));

      if (this.loaded && !object.loaded) {
        object.load();
      }

      return object;
    },
    removeChild(object) {
      let child;

      for (let i = 0; i < this._children.length; i++) {
        child = this._children[i];

        if (child.object === object) {
          if (object.loaded) {
            object.unload();
          }

          this._children.splice(i, 1);

          break;
        }
      }

      return child;
    },
    removeAllChildren() {
      for (let i = 0; i < this._children.length; i++) {
        this._children[i].object.unload();
      }

      this._children = [];
    },
    removeChildrenOfType(type) {
      _.each(this.getChildrenOfType(type), (object) => {
        this.removeChild(object);
      });
    },
    getChildOfType(type, role) {
      const encapsulatedObject = _.find(this._children, { type, role });

      if (encapsulatedObject) {
        return encapsulatedObject.object;
      }
      return null;

      return encapsulatedObject && encapsulatedObject.object;
    },
    getChildrenOfType(type, roles) {
      // Simply find children by type, or look for type as well.
      const encapsulatedObjects = _.filter(this._children, (encapsulatedObject) => {
        if (!_.isArray(roles) || !roles.length) {
          return encapsulatedObject.type === type;
        }
        return encapsulatedObject.type === type && roles.indexOf(encapsulatedObject.role) !== -1;
      });

      return _.map(encapsulatedObjects, encapsulatedObject => encapsulatedObject.object);
    },
    getChildren() {
      return _.map(this._children, encapsulatedObject => encapsulatedObject.object);
    },
    removeChildOfRole(type, role) {
      const currentObject = _.find(this._children, { type, role });

      if (currentObject) {
        this.removeChild(currentObject.object);
      }

      return currentObject;
    },

    // Convenience wrappers
    addView(view, role) {
      return this.addChild('view', view, role);
    },
    removeView(view) {
      return this.removeChild(view);
    },
    removeAllViews() {
      return this.removeChildrenOfType('view');
    },
    getViews(roles) {
      return this.getChildrenOfType('view', roles);
    },
    getView(role) {
      return this.getChildOfType('view', role);
    },
    addController(controller, role) {
      return this.addChild('controller', controller, role);
    },
    removeController(controller) {
      this.removeChild(controller);
    },
    getControllers() {
      return this.getChildrenOfType('controller');
    },
    getController(role) {
      return this.getChildOfType('controller', role);
    },

    // Convenience wrappers for loading, unloading, waking and sleeping
    load() {
      if (!this.loaded) {
        this._executeMethodStack('load');

        this.loaded = true;
      }

      return this;
    },
    loadChildren() {
      return this._executeChildMethods('load');
    },
    unload() {
      if (this.loaded) {
        this._executeMethodStack('unload');

        this.loaded = false;

        this._children = [];
      }

      return this;
    },
    unloadChildren() {
      return this._executeChildMethods('unload');
    },
    sleep() {
      if (this.loaded && !this.sleeping) {
        this._executeMethodStack('sleep');

        this.sleeping = true;
      }

      return this;
    },
    sleepChildren() {
      return this._executeChildMethods('sleep');
    },
    wake() {
      if (this.sleeping) {
        this._executeMethodStack('wake');

        this.sleeping = false;
      }

      return this;
    },
    wakeChildren() {
      return this._executeChildMethods('wake');
    },

    // Event propagation
    stopPropagation(object) {
      this.stopListening(object);
    },
    propagateEvents(object) {
      this.listenTo(object, 'all', this._propagateEvent);
    },
    _propagateEvent() {
      this.trigger.apply(this, arguments);
    },

    // Dummy functions
    beforeLoad() {},
    afterLoad() {},
    beforeUnload() {},
    afterUnload() {},
    beforeSleep() {},
    afterSleep() {},
    beforeWake() {},
    afterWake() {},
  };
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/mixins/loadunload.js