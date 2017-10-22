module.exports = (function () {
  let cache = {};

  function set(name, id, model) {
    if (!cache[name]) {
      cache[name] = {};
    }

    cache[name][id] = model;

    return model;
  }

  function get(name, id) {
    if (cache[name]) {
      return cache[name][id];
    }

    return null;
  }

  function remove(name, id) {
    if (cache[name]) {
      delete cache[name][id];
    }
  }

  function flush(name) {
    if (name) {
      delete cache[name];

      return;
    }

    cache = {};
  }

  return {
    _showCache: cache,
    get,
    set,
    remove,
    flush,
  };
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/modelcache.js