import React, { Component } from 'react';
import { wrapDisplayName } from 'recompose';
import CSS from './style.scss';

export default ComposedComponent =>
  class ResetStyles extends Component {
    static displayName = wrapDisplayName(ComposedComponent, 'resetStyles');

    componentDidMount() {
      document.body.classList.add(CSS.reset);
    }

    componentWillUnmount() {
      document.body.classList.remove(CSS.reset);
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/resetStyles/index.js