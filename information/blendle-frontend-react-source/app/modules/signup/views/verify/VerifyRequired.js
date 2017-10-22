import React from 'react';
import PropTypes from 'prop-types';
import { translate, translateElement } from 'instances/i18n';

class VerifyRequired extends React.Component {
  static propTypes = {
    isResend: PropTypes.bool,
    user: PropTypes.object.isRequired,
    onResend: PropTypes.func.isRequired,
  };

  _onResend = (ev) => {
    ev.preventDefault();
    this.props.onResend();
  };

  render() {
    let resend;
    if (this.props.isResend) {
      resend = translateElement(<p className="resend done" />, 'signup.verifyEmail.resend', [
        this.props.user.get('email'),
      ]);
    } else {
      resend = (
        <p className="resend">
          {translateElement(<a href="#" onClick={this._onResend} />, 'signup.verifyEmail.resend')}
        </p>
      );
    }

    return (
      <form className="v-verify-required">
        <div className="verify-content">
          <h2>{translate('signup.verifyRequired.title')}</h2>
          {resend}
        </div>
      </form>
    );
  }
}

export default VerifyRequired;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/verify/VerifyRequired.js