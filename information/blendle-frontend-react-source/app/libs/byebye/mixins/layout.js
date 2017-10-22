module.exports = (function () {
  return {
    setLayout(layout) {
      this.resetLayout();
      this.addLayout(layout);
    },

    resetLayout() {
      const classes = this.el.className.match(/\bl-\S+/g) || [];
      for (let i = 0; i < classes.length; i++) {
        this.el.classList.remove(classes[i]);
      }
    },

    addLayout(layout) {
      this.el.classList.add(`l-${layout}`);
    },

    removeLayout(layout) {
      this.el.classList.remove(`l-${layout}`);
    },
  };
}());



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/mixins/layout.js