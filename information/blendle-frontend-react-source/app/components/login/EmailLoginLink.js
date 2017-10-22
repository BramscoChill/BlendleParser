import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translateElement } from 'instances/i18n';
import { STATUS_OK, STATUS_ERROR } from 'app-constants';

export default class EmailLoginLink extends React.Component {
  static propTypes = {
    onSendLoginEmail: PropTypes.func.isRequired,
    emailLoginState: PropTypes.object,
    email: PropTypes.string,
  };

  state = {
    email: undefined,
  };

  _onClick = (ev) => {
    // the error messages contain a link to send the login email
    if (ev.target.nodeName === 'A') {
      ev.preventDefault();
      this.props.onSendLoginEmail();

      // The email address may not be updated every time, only if there was send a email to
      this.setState({
        email: this.props.email,
      });
    }
  };

  render() {
    const status = this.props.emailLoginState.status;
    const className = classNames('login-email-message', {
      's-success': status === STATUS_OK,
      's-error': status === STATUS_ERROR,
    });

    let text = 'emaillogin.login.propose';
    let testId = 'magic-email-login';
    if (status === STATUS_OK) {
      text = 'emaillogin.login.send';
      testId += '-send';
    } else if (status === STATUS_ERROR) {
      text = 'emaillogin.login.invalid';
      testId += '-invalid';
    }

    // generate a new key for the element, so it will be rerendered.
    // this is to restart the animation when at the STATUS_OK state
    const key = Math.random();

    return translateElement(
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <p key={key} className={className} onClick={this._onClick} data-test-identifier={testId} />,
      /* eslint-enable */
      text,
      [this.state.email],
      false,
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/login/EmailLoginLink.js