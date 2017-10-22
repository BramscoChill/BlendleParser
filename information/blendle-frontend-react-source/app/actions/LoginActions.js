import alt from 'instances/altInstance';
import Auth from 'controllers/auth';
import AuthActions from 'actions/AuthActions';
import { INVALID_TOKEN, XHR_STATUS, MISSING_PASSWORD } from 'app-constants';
import parseJWT from 'helpers/parseJWT';
import { removeOrigin } from 'helpers/url';
import browserHistory from 'react-router/lib/browserHistory';
import Analytics from 'instances/analytics';
import axios from 'axios';
import Settings from 'controllers/settings';
import ApplicationState from 'instances/application_state';
import URI from 'urijs';
import { history } from 'byebye';

function getRedirect({ item_id: itemId, redirect }) {
  const uri = new URI();

  if (itemId) {
    return { redirectUrl: `/item/${itemId}` };
  }

  const query = uri.query(true);

  if (query.redirect) {
    const redirectUri = new URI(query.redirect);

    return {
      redirectUrl: redirectUri.pathname(),
      query: redirectUri.query(true),
    };
  }

  if (redirect) {
    return { redirectUrl: removeOrigin(redirect) };
  }

  return { redirectUrl: '/' };
}

export default alt.createActions({
  loginWithEmailTokenAndRedirect(token) {
    const data = parseJWT(token);
    const { redirectUrl, query } = getRedirect(data);

    Auth.loginWithCredentials({ email_token: token })
      .then(() => {
        Analytics.track('Login Successful', {
          platform: 'blendle',
          login_type: 'email',
        });

        history.navigate({ pathname: redirectUrl, query }, { trigger: true, replace: true });
      })
      .catch((err) => {
        if (err.type === INVALID_TOKEN) {
          const userId = Auth.getId();
          // User is authenticated with same ID as in token
          if (userId === data.user_id) {
            // Navigate to the URL in token
            history.navigate({ pathname: redirectUrl, query }, { trigger: true, replace: true });
            return;
          }

          this.setEmail(data.user_email);
          ApplicationState.set('requireAuthUrl', redirectUrl);

          // User is authenticated with another account, logout.
          if (!!userId && userId !== data.user_id) {
            AuthActions.logout();
          }

          browserHistory.replace('/login');
          return;
        }

        throw err;
      });

    return null;
  },

  /**
   * Log in using email/username and password
   * @param {Object} credentials { login, password } or { facebook_id, facebook_access_token }
   */
  loginWithCredentials(credentials, analyticsPayload) {
    Auth.loginWithCredentials(credentials)
      .then(data => this.loginSuccess(data, analyticsPayload))
      .catch((err) => {
        if (err.type === INVALID_TOKEN || err.type === MISSING_PASSWORD) {
          return this.loginError(err);
        }
        throw err;
      });

    return null;
  },

  loginSuccess(data, analyticsPayload = {}) {
    Analytics.track('Login Successful', {
      platform: 'blendle',
      ...analyticsPayload,
    });

    return data;
  },

  loginError(err) {
    Analytics.track('Login Error', {
      event: err.message || err.type,
      platform: 'blendle',
    });

    return err;
  },

  /**
   * Request a Login email using email/username
   * @param {string} login  userId or email
   * @param {string} itemId the ID of the item to redirect to
   * @param {string} redirectUrl the URL to be redirected to
   * @param {boolean} [forceSend=false]
   * @param {Object} Analytics payload
   */
  sendLoginEmail(login, itemId, redirectUrl, forceSend = false, analytics = {}) {
    const { protocol, hostname, port } = window.location;
    // Use 'email' key for an email and 'user_id' for an userId
    const urlPort = port ? `:${port}` : '';
    const urlBase = `${protocol}//${hostname}${urlPort}/login-email`;
    const data = {
      ...(login.includes('@') ? { email: login } : { user_id: login }),
      ...(itemId ? { item_id: itemId } : null),
      ...(redirectUrl
        ? { redirect: `${urlBase}/{email_token}?redirect=${encodeURIComponent(redirectUrl)}` }
        : null),
      force_send: forceSend,
    };

    Analytics.track('Magic Login Email Start', analytics);

    axios
      .post(Settings.getLink('email_tokens'), data)
      .then((res) => {
        Analytics.track('Magic Login Email Success', analytics);

        this.sendLoginEmailSuccess(res);
      })
      .catch((err) => {
        Analytics.track('Magic Login Email Error', {
          ...analytics,
          error: err.status,
        });

        if (err.type === XHR_STATUS && err.status === 404) {
          return this.sendLoginEmailError(err);
        }
        throw err;
      });

    return null;
  },

  sendLoginEmailSuccess: x => x,

  sendLoginEmailError: x => x,

  setEmail(email) {
    return email;
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/LoginActions.js