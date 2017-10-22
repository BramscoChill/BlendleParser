import { history } from 'byebye';
import React from 'react';
import AltContainer from 'alt-container';
import { MANUAL_LOGOUT } from 'app-constants';
import { loginIfAuthorized as autoFacebookLogin } from 'managers/facebook';
import Analytics from 'instances/analytics';
import parseJWT from 'helpers/parseJWT';
import { decode as decodeBase64 } from 'helpers/base64';
import Auth from 'controllers/auth';
import LoginActions from 'actions/LoginActions';
import LoginStore from 'stores/LoginStore';
import EmailLoginPage from './EmailLoginPage';
import TokenErrorPage from './TokenErrorPage';

export function openTokenLogin(token) {
  LoginActions.loginWithEmailTokenAndRedirect(token);
  return (
    <AltContainer
      component={TokenErrorPage}
      stores={{ LoginStore }}
      actions={{ LoginActions }}
      inject={{
        data: parseJWT(token),
      }}
    />
  );
}

export function openItemLogin(itemId, token, force) {
  if (Auth.getId()) {
    const url = `/item/${itemId}`;
    history.navigate(url, { trigger: true, replace: false }, { returnUrl: '/' });
    return <span />;
  }

  Analytics.track('Email login/deeplink landing');

  const tokenData = JSON.parse(decodeBase64(token));
  const data = {
    item_id: itemId,
    user_id: tokenData.id,
    domain: tokenData.domain,
    name: tokenData.name,
  };

  // auto login with facebook, and when FB login fails we will send you an email
  autoFacebookLogin()
    .then(() => {
      LoginActions.loginSuccess(null, {
        login_type: 'facebookautologin',
        platform: 'facebook',
      });
    })
    .catch((err) => {
      if (err.type === MANUAL_LOGOUT || err.type === 'UnableToLogin') {
        // Convert the force parameter to a boolean. If `true`, it forces the backend to send the
        // email, regardless of the default time limit of once a day.
        LoginActions.sendLoginEmail(data.user_id, data.item_id, data.redirect, !!force);
        return;
      }
      throw err;
    });

  return (
    <AltContainer
      component={EmailLoginPage}
      stores={{ loginState: LoginStore }}
      inject={{ data }}
    />
  );
}



// WEBPACK FOOTER //
// ./src/js/app/modules/emailLogin/module.js