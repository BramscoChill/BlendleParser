import React from 'react';
import PropTypes from 'prop-types';
import { translate, translateElement } from 'instances/i18n';

export default class SignUpVerification extends React.Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
    onResend: PropTypes.func.isRequired,
  };

  state = {
    isResend: false,
  };

  _onResend(ev) {
    ev.preventDefault();
    this.setState({ isResend: true });
    this.props.onResend();
  }

  _renderResendMessage() {
    if (this.state.isResend) {
      return translateElement('signup.verifyEmail.isResend', [this.props.email], false);
    }
    return translateElement('signup.verifyEmail.resend', false);
  }

  render() {
    return (
      <div className="v-verification">
        <div className="deeplink-verification">
          <img src="/img/signup/newemail.gif" width="210" height="150" alt="" />
          <h2>{translate('deeplink.verification.title')}</h2>
          <p className="thanks">{translate('deeplink.verification.thanks')}</p>
          <p className="resend" onClick={this._onResend.bind(this)}>
            {this._renderResendMessage()}
          </p>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/signUp/SignUpVerification.js