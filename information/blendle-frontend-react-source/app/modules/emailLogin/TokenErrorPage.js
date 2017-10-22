import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_ERROR } from 'app-constants';
import withRouter from 'react-router/lib/withRouter';
import Logo from 'components/Logo';
import Link from 'components/Link';
import { translate, translateElement } from 'instances/i18n';

function isUsedTokenError(status, message) {
  return status === 403 && message === 'token already used';
}

function isExpiredTokenError(status, message) {
  return status === 401 && message === 'expired token';
}

class TokenErrorPage extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    LoginStore: PropTypes.object.isRequired,
    LoginActions: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  // componentWillReceiveProps (nextProps) {
  //   const { LoginStore, LoginActions, data, router, toLoginFormOnError } = this.props;
  //   const newLoginError = nextProps.LoginStore.login.error;
  //   const currentLoginError = LoginStore.login.error;
  //
  //   // Check for new error
  //   if (currentLoginError || !newLoginError) {
  //     return;
  //   }
  //
  //   if (isExpiredTokenError(newLoginError.status, newLoginError.message) ||
  //     isUsedTokenError(newLoginError.status, newLoginError.message)) {
  //
  //     if (toLoginFormOnError) {
  //       setTimeout(() => {
  //         LoginActions.setEmail(data.user_email);
  //         router.replace('/login');
  //       });
  //
  //       return;
  //     }
  //
  //     // Send new token
  //     LoginActions.sendLoginEmail.defer(data.user_id, data.item_id, data.redirect);
  //   }
  // }

  _renderMessage() {
    return (
      <div>
        <img
          src="/img/illustrations/magiclink.svg"
          className="magic-link-illustration"
          alt="Magic link illustration"
        />
        <h1>{translate('app.email_login.token_error')}</h1>
        {translateElement(<p />, 'app.email_login.token_resent', false)}
      </div>
    );
  }

  render() {
    let message = <div />;
    if (this.props.LoginStore.login.status === STATUS_ERROR) {
      message = this._renderMessage();
    }

    return (
      <div className="v-email-login-page">
        <header className="header">
          <Link href="/">
            <Logo />
          </Link>
        </header>
        <div className="login-error">
          <div className="body">{message}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(TokenErrorPage);



// WEBPACK FOOTER //
// ./src/js/app/modules/emailLogin/TokenErrorPage.js