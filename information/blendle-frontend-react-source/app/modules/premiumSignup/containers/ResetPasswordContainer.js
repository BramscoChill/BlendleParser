import React from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import { replaceLastPath } from 'helpers/url';
import ResetPassword from '../components/ResetPassword';

class ResetPasswordContainer extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  _onClickLogin = () => {
    this.props.router.push(replaceLastPath(window.location.pathname, 'login'));
  };

  render() {
    return <ResetPassword onClickLogin={this._onClickLogin} {...this.props} />;
  }
}

export default withRouter(ResetPasswordContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/ResetPasswordContainer.js