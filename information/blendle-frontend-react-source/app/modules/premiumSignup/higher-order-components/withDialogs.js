import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SignupDialog from '../components/SignupDialog';

import { replaceLastPath } from 'helpers/url';

export default ComposedComponent =>
  class WithDialog extends PureComponent {
    static propTypes = {
      header: PropTypes.element,
      body: PropTypes.element,
      footer: PropTypes.element,
      overlay: PropTypes.element,
      product: PropTypes.object,
      route: PropTypes.object.isRequired,
    };

    _onClose = () => {
      const closeRoute = replaceLastPath(window.location.pathname, '');

      this.props.router.push(closeRoute);
    };

    _renderSignupDialog() {
      const { header, body, footer, route, overlay } = this.props;

      if (body) {
        return (
          <SignupDialog
            header={header}
            body={body}
            footer={footer}
            route={route}
            overlay={overlay}
            onClose={this._onClose}
          />
        );
      }

      return null;
    }

    render() {
      return (
        <div>
          <ComposedComponent {...this.props} />
          {this._renderSignupDialog()}
        </div>
      );
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/higher-order-components/withDialogs.js