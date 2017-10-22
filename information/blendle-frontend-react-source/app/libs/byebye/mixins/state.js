export default {
  setState(state) {
    this.resetState();
    this.addState(state);
  },

  resetState() {
    if (this.el) {
      const classes = this.el.className.match(/\bs-\S+/g) || [];
      for (let i = 0; i < classes.length; i++) {
        this.el.classList.remove(classes[i]);
      }
    }
  },

  addState(state) {
    if (this.el) {
      this.el.classList.add(`s-${state}`);
    }
  },

  removeState(state) {
    if (this.el) {
      this.el.classList.remove(`s-${state}`);
    }
  },
};



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/mixins/state.js