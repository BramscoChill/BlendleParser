import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'instances/i18n';
import FacebookConnect from './FacebookConnect';
import Analytics from 'instances/analytics';

export default class FacebookConnectContainer extends React.Component {
  static propTypes = {
    buttonText: PropTypes.string,
    analyticsName: PropTypes.string,
    analyticsPayload: PropTypes.object,
    onLogin: PropTypes.func,
    onSignUp: PropTypes.func,
    onError: PropTypes.func,
    onClick: PropTypes.func,

    // provide extra data to send to the signup and confirmation webservice
    // this could contain keys like `referrer` or `entry_item`
    signUpContext: PropTypes.object,
    signUpType: PropTypes.string,
  };

  static defaultProps = {
    analyticsName: 'Login Form',
    analyticsPayload: {},
    signUpContext: {},
  };

  state = {
    error: null,
  };

  _onError(err) {
    Analytics.track(this.props.analyticsName, {
      event: 'signup_error_facebook',
      error: err.message,
    });

    this._setError('app.error.error_default');

    const { onError } = this.props;
    if (typeof onError === 'function') {
      onError(err);
    }
  }

  _onSignUp(...args) {
    this.props.onSignUp(...args);
  }

  _onLogin(...args) {
    Analytics.track('Login Successful', {
      ...this.props.analyticsPayload,
      platform: 'facebook',
    });

    this.props.onLogin(...args);
  }

  _setError(msg) {
    let error;
    if (msg) {
      error = translate(msg);
    }
    this.setState({ error });
  }

  render() {
    return (
      <FacebookConnect
        signUpType={this.props.signUpType}
        error={this.state.error}
        buttonText={this.props.buttonText}
        onSignUp={this._onSignUp.bind(this)}
        onLogin={this._onLogin.bind(this)}
        onError={this._onError.bind(this)}
        onClick={this.props.onClick}
        signUpContext={this.props.signUpContext}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/facebookConnect/FacebookConnectContainer.js