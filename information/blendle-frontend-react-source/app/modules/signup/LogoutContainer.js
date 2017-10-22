import React from 'react';
import PropTypes from 'prop-types';
import Auth from 'controllers/auth';

export default class LogoutContainer extends React.Component {
  static propTypes = {
    params: PropTypes.object,
  };

  componentDidMount() {
    Auth.logout().then(() => {
      const { email } = this.props.params;
      window.location = email ? `/login?email=${email}` : '/';
    });
  }

  render() {
    return <div />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/LogoutContainer.js