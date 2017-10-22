import React, { Component } from 'react';
import { debounce } from 'lodash';
import { wrapDisplayName } from 'recompose';
import { isMobileBreakpoint, isTabletBreakpoint } from 'helpers/viewport';

const defaultOptions = {
  debounce: 10,
};

export default (options = defaultOptions) => ComposedComponent =>
  class WithViewportSize extends Component {
    static displayName = wrapDisplayName(ComposedComponent, 'withViewportSize');

    state = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      isMobileViewport: isMobileBreakpoint(),
      isTabletViewport: isTabletBreakpoint(),
    };

    componentDidMount() {
      window.addEventListener('resize', this._onResize);
    }

    componentWillUnmount() {
      this._onResize.cancel();
      window.removeEventListener('resize', this._onResize);
    }

    _onResize = debounce(() => {
      this.setState({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        isMobileViewport: isMobileBreakpoint(),
        isTabletViewport: isTabletBreakpoint(),
      });
    }, options.debounce);

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/withViewportSize.js