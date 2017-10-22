import { history } from 'byebye';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ModuleNavigation from './ModuleNavigation';
import { getComponents } from 'helpers/moduleNavigationHelpers';

export default class ModuleNavigationPortal extends Component {
  static propTypes = {
    children: PropTypes.node,
    items: PropTypes.array,
  };

  componentDidMount() {
    this._renderLayer();
  }

  componentDidUpdate() {
    this._renderLayer();
  }

  componentWillUnmount() {
    const target = this._getTarget();
    if (target) {
      ReactDOM.unmountComponentAtNode(target);
    }
  }

  _getTarget() {
    return document.querySelector('.moduleNavigationPortalRoot');
  }

  _renderLayer() {
    const target = this._getTarget();
    if (!target) {
      return;
    }
    let children = this.props.children;
    if (this.props.items) {
      children = getComponents(this.props.items, history.fragment);
    }
    ReactDOM.render(<ModuleNavigation>{children}</ModuleNavigation>, target);
  }

  render() {
    return null;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/moduleNavigation/ModuleNavigationPortal.js