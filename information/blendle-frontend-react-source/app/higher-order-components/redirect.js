import React, { Component } from 'react';
import { oneOfType, string, shape, func, object } from 'prop-types';
import { wrapDisplayName } from 'recompose';
import { withRouter } from 'react-router';

const redirect = ({ to, replace = false, renderNothing = false } = {}) => ComposedComponent =>
  withRouter(
    class Redirect extends Component {
      static displayName = wrapDisplayName(ComposedComponent, 'redirect');

      static propTypes = {
        redirectTo: oneOfType([
          string,
          shape({
            pathname: string,
            query: object,
            state: object,
          }),
        ]),
        router: shape({
          replace: func.isRequired,
        }).isRequired,
      };

      componentWillMount() {
        const { router } = this.props;
        const destination = this.props.redirectTo ? this.props.redirectTo : to;
        const redirectTo = replace ? router.replace : router.push;

        setTimeout(() => redirectTo(destination));
      }

      render() {
        if (renderNothing) {
          return null;
        }
        return <ComposedComponent {...this.props} />;
      }
    },
  );

export default redirect;



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/redirect.js