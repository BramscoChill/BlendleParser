import React from 'react';
import PropTypes from 'prop-types';
import ApplicationActions from 'actions/ApplicationActions';
import { getPrevious } from 'libs/byebye/history';

export function getReturnUrl(routeUrl, nextState) {
  const url = (nextState && nextState.returnUrl) || getPrevious();
  if (url === routeUrl) {
    return '/';
  }
  return url;
}

/**
 * set the application into loading state when making a async route call
 * example; when using bundle splitting it is useful to show a loader on slow connections
 * @param   {Function} getComponentsHandler, as defined by React Router
 * @returns {Function(nextState, resolve)}
 */
export function asyncRoute(getComponentsHandler) {
  return (nextState, resolve) => {
    ApplicationActions.statusPending.defer();

    return getComponentsHandler(nextState, (...args) => {
      ApplicationActions.statusOk.defer();
      resolve(...args);
    });
  };
}

/**
 * create a Component that will render the Component resolved by the given function.
 * use-case is an async route that needs to render a component immediately. See the timeline module
 * for an example
 * @param   {Function} getComponent
 * @returns {Function}
 */
export function createAsyncComponent(getComponent) {
  return (props, extraProps = {}) => (
    <AsyncComponent getComponent={getComponent} {...props} {...extraProps} />
  );
}

class AsyncComponent extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = { component: null };
  }

  componentDidMount() {
    setTimeout(() => this.props.getComponent(this.onResolve, this.props));
  }

  componentWillUnmount() {
    this.onResolve = null;
  }

  onResolve = (Component) => {
    if (!Component) {
      return;
    }
    this.setState({
      component: Component,
    });
  };

  render() {
    if (this.state.component) {
      if (React.isValidElement(this.state.component)) {
        return this.state.component;
      }
      return <this.state.component {...this.props} />;
    }
    return null;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/routerHelpers.js