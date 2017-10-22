module.exports = (function () {
  return {
    Events: require('backbone').Events,
    history: require('libs/byebye/history'),
    Collection: require('libs/byebye/collection'),
    Controller: require('libs/byebye/controller'),
    Model: require('libs/byebye/model'),
    ModelCache: require('libs/byebye/modelcache'),
    View: require('libs/byebye/view'),
    ReactView: require('libs/byebye/reactview'),
    sync: require('libs/byebye/sync'),
    ajax: require('http/ajax'),
    Mixins: {
      Links: require('libs/byebye/mixins/links'),
      EventListener: require('libs/byebye/mixins/eventlistener'),
    },
    Helpers: {
      modelId: require('libs/byebye/helpers/modelid'),
      toArray: require('libs/byebye/helpers/toarray'),
    },
  };
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/byebye.js