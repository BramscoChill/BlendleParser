import React from 'react';
import PropTypes from 'prop-types';
import BackboneView from 'components/shared/BackboneView';
import FacebookConnectView from 'views/facebookconnect';

export default class FacebookConnect extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func,
    onSignUp: PropTypes.func,
    onConnect: PropTypes.func,
    onError: PropTypes.func,
    onClick: PropTypes.func,
    error: PropTypes.string,
    className: PropTypes.string,
    buttonText: PropTypes.string,
    signUpContext: PropTypes.object,
    signUpType: PropTypes.string,
  };

  componentWillMount() {
    this.view = new FacebookConnectView({
      text: this.props.buttonText,
      className: this.props.className || 'v-facebook-connect',
      onClick: this.props.onClick,
      onConnect: (type, user) => {
        if (type === 'signIn') {
          if (this.props.onLogin) {
            this.props.onLogin();
          }
        } else if (this.props.onSignUp) {
          this.props.onSignUp(user);
        }
        if (this.props.onConnect) {
          this.props.onConnect(type);
        }
      },
      onFail: (err) => {
        if (this.props.onError) {
          this.props.onError(err);
        }
      },
      signUpContext: this.props.signUpContext,
      signUpType: this.props.signUpType,
    });
  }

  _renderError() {
    if (!this.props.error) {
      return;
    }
    return <div className="error-message visible">{this.props.error}</div>;
  }

  render() {
    return (
      <div className={this.props.className}>
        <BackboneView view={this.view} />
        {this._renderError()}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/facebookConnect/FacebookConnect.js