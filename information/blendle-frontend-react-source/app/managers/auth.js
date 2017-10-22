import { ajax } from 'byebye';
import Settings from 'controllers/settings';
import Environment from 'environment';
import Token from 'models/token';
import TypedError from 'helpers/typederror';
import { INVALID_TOKEN } from 'app-constants';

function createToken(data) {
  return new Token(data, { parse: true });
}

export default {
  /**
   * Fetch a request token to authenticate each XHR call.
   * @param {String} refreshToken
   * @returns {Promise}
   */
  fetchToken(refreshToken) {
    return ajax({
      skipJWTRefresh: true,
      url: Environment.tokens,
      type: 'POST',
      headers: {
        // Make sure we don't send a auth header, since it might has been expired.
        Authorization: null,
      },
      data: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(response => createToken({ refresh_token: refreshToken, ...response.data }))
      .catch((err) => {
        if (err.status === 401 || err.status === 404) {
          throw new TypedError(
            INVALID_TOKEN,
            'Unable to fetch token with current refreshToken',
            err,
          );
        }
        throw err;
      });
  },

  /**
   * Fetch the tokens by passing the login credentials.
   * @param {Object} credentials { login, password } or { facebook_id, facebook_access_token, fb_auto_logged_in }
   * @return {Promise}
   */
  fetchTokenByCredentials(credentials) {
    return ajax({
      skipJWTRefresh: true,
      url: Settings.getLink('credentials'),
      type: 'POST',
      data: JSON.stringify(credentials),
    }).then(response => createToken(response.data));
  },

  /**
   * Revoke a refresh token on the server. This will invalidate the JWT token.
   * @param {String} userId
   * @param {String} refreshToken
   * @returns {Promise}
   */
  revokeRefreshToken(userId, refreshToken) {
    return ajax({
      skipJWTRefresh: true,
      url: Settings.getLink('user_refresh_token', {
        user_id: userId,
        refresh_token: refreshToken,
      }),
      type: 'DELETE',
    }).catch((err) => {
      if (err.status === 401) {
        throw new TypedError(
          INVALID_TOKEN,
          'Unable to revoke token with current refreshToken',
          err,
        );
      }
      throw err;
    });
  },

  /**
   * Revoke all tokens, so the user will be signed out at all devices.
   * @param {String} userId
   * @returns {Promise}
   */
  revokeAllRefreshTokens(userId) {
    return ajax({
      skipJWTRefresh: true,
      url: Settings.getLink('user_refresh_tokens', {
        user_id: userId,
      }),
      type: 'DELETE',
    }).catch((err) => {
      if (err.status === 401) {
        throw new TypedError(
          INVALID_TOKEN,
          'Unable to revoke all refresh tokens with current refreshToken',
          err,
        );
      }
      throw err;
    });
  },
};



// WEBPACK FOOTER //
// ./src/js/app/managers/auth.js