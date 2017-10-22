module.exports = (function () {
  // Libraries
  const _ = require('lodash');
  const Backbone = require('backbone');

  // Override Backbone.sync. We don't use PUT or PATCH requests.
  const methodMap = {
    create: 'POST',
    update: 'POST',
    patch: 'POST',
    delete: 'DELETE',
    read: 'GET',
  };

  const urlError = function () {
    throw new Error('A "url" property or function must be specified');
  };

  const sync = function (method, model, options) {
    const type = methodMap[method];

    // The following is mostly duplicate sync code. We just wanted to override
    // the methodMap.
    //
    //

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON,
    });

    // Default JSON-request options.
    const params = { type, dataType: 'json' };

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    //
    // Backbone.sync checks (options.data == null). eqeqeq jslint won't allow that. This works as well.
    if (
      !options.data &&
      model &&
      (method === 'create' || method === 'update' || method === 'patch')
    ) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? { model: params.data } : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';

      if (options.emulateJSON) params.data._method = type;
      const beforeSend = options.beforeSend;
      options.beforeSend = function (xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (
      params.type === 'PATCH' &&
      window.ActiveXObject &&
      !(window.external && window.external.msActiveXFilteringEnabled)
    ) {
      params.xhr = function () {
        return new window.ActiveXObject('Microsoft.XMLHTTP');
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    const xhr = (options.xhr = Backbone.ajax(_.extend(params, options)));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  Backbone.sync = sync;

  return sync;
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/sync.js