import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withRouter from 'react-router/lib/withRouter';
import LoginWarningDialogue from 'components/dialogues/LoginWarningDialogue';

class LoginWarning extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  _onClose = () => {
    this.props.router.push('/getpremium');
  };

  render() {
    return <LoginWarningDialogue onClose={this._onClose} />;
  }
}

export default withRouter(LoginWarning);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/LoginWarning.js