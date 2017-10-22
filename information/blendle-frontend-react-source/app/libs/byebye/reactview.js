import React from 'react';
import ReactDOM from 'react-dom';
import View from './view';

export default class ReactView extends View {
  render(props = {}) {
    const component = this.options.renderComponent(props);
    if (component) {
      this._instance = ReactDOM.render(component, this.el);
    } else {
      ReactDOM.unmountComponentAtNode(this.el);
    }
    return this;
  }

  getComponentInstance() {
    return this._instance;
  }

  unload() {
    ReactDOM.unmountComponentAtNode(this.el);
    View.prototype.unload.apply(this, arguments);
  }
}



// WEBPACK FOOTER //
// ./src/js/app/libs/byebye/reactview.js