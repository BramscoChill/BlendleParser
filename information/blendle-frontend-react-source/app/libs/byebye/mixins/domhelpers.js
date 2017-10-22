module.exports = (function () {
  function $(selector, context) {
    context = context || document;

    if (selector instanceof Node) {
      return selector;
    }
    if (typeof selector === 'string') {
      return $(context).querySelectorAll(selector);
    }
  }

  return {
    /**
     * shorthand method,
     * overwrites the exojs dollar method
     */
    $(selector, context) {
      return this.find(selector, context);
    },

    /**
     * overwrites the exojs find method
     * @param {String|Node} selector
     * @param {String|Node} [context]
     * @returns {HTMLElement|undefined}
     */
    find(selector, context) {
      return $(selector, context || this.el)[0];
    },

    /**
     * overwrites the exojs findAll method
     * @param {String|Node} selector
     * @param {String|Node} [context]
     * @returns {Array}
     */
    findAll(selector, context) {
      return Array.prototype.slice.call($(selector, context || this.el));
    },
  };
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/mixins/domhelpers.js