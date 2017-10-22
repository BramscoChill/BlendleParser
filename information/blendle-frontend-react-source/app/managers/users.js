const ByeBye = require('byebye');
const _ = require('lodash');
const Settings = require('controllers/settings');
const Auth = require('controllers/auth');
const Token = require('models/token');
const User = require('models/user');

const UsersManager = {
  /**
   * Request a reset password token for e-mail
   * @param  {String} email
   * @return {Promise}
   */
  requestResetToken(email) {
    return ByeBye.ajax({
      url: Settings.get('links').request_password_reset_token.href,
      type: 'post',
      data: JSON.stringify({ email }),
    });
  },

  /**
   * Reset a users' password with a resettoken from the server
   *
   * @param  {String} token
   * @param  {String} newPassword
   * @return {Promise}
   */
  resetPassword(token, newPassword) {
    return ByeBye.ajax({
      url: Settings.get('links').password_reset.href,
      type: 'post',
      data: JSON.stringify({ password: newPassword, token }),
    }).then(resp => Auth.loginWithToken(new Token(resp.data, { track: true, parse: true })));
  },

  /**
   * Follow a user
   * @param  {User} user
   * @param  {User} userToFollow
   * @return {Promise}
   */
  followUser(user, usersToFollow) {
    usersToFollow = ByeBye.Helpers.toArray(usersToFollow);

    return ByeBye.ajax({
      url: Settings.getLink('follows', { user_id: user.id }),
      data: JSON.stringify({
        user_uids: usersToFollow.map(user => ({ id: ByeBye.Helpers.modelId(user) })),
      }),
      type: 'POST',
    }).then(() => {
      usersToFollow.forEach((userToFollow) => {
        if (user.increaseFollowCount) {
          user.increaseFollowCount();
        }

        if (userToFollow.setFollowed) {
          userToFollow.setFollowed();
        }
      });

      return Promise.resolve(usersToFollow);
    });
  },

  /**
   * Unfollow a user
   * @param  {User} user
   * @param  {User} userToUnfollow
   * @return {Promise}
   */
  unfollowUser(user, userToUnfollow) {
    return ByeBye.ajax({
      url: `${Settings.getLink('follows', { user_id: user.id })}/${userToUnfollow.id}`,
      type: 'DELETE',
    }).then(() => {
      user.decreaseFollowCount();

      if (userToUnfollow.unsetFollowed) {
        userToUnfollow.unsetFollowed();
      }

      return Promise.resolve(userToUnfollow);
    });
  },

  toggleFollow(user, targetUser) {
    if (targetUser.get('following')) {
      return this.unfollowUser(user, targetUser);
    }
    return this.followUser(user, targetUser);
  },

  /**
   * Save Facebook credentials to user
   *
   * @param {User} user
   * @param {Object} authResponse
   * @return {Promise}
   */
  saveFacebookCredentials(user, authResponse) {
    return ByeBye.ajax({
      url: Settings.getLink('user', { user_id: user.id }),
      type: 'POST',
      data: JSON.stringify({
        facebook_id: authResponse.userID,
        facebook_access_token: authResponse.accessToken,
      }),
    }).then(() => {
      user.set('facebook_id', authResponse.userID);
      user.set('facebook_access_token', authResponse.accessToken);

      return Promise.resolve(user);
    });
  },

  /**
   * Disconnect the given user from Facebook
   *
   * @param  {User} user
   * @return {Promise}
   */
  disconnectFromFacebook(user) {
    return this.saveFacebookCredentials(user, {
      userID: null,
      accessToken: null,
    });
  },

  /**
   * Follow the collection of users
   * @param  {User} user User that should follow users
   * @param  {Users|Array|String} users Users to follow
   * @return {Promise}
   */
  followUsers(user, users) {
    const usersToFollow = users.filter(
      userToFollow => ByeBye.Helpers.modelId(userToFollow) !== ByeBye.Helpers.modelId(user),
    );

    return Promise.all(
      _.map(usersToFollow, userToFollow =>
        UsersManager.followUser(user, userToFollow).catch(Promise.resolve),
      ),
    ).then(() => Promise.resolve(usersToFollow));
  },

  /**
   * Get a user based on user id. Use cache if available. Returns a promise
   * @param  {String} userId
   * @return {Promise}
   */
  getUser(userId) {
    const user = new User({ id: userId }, { track: true });
    if (user.get('fullname')) {
      return Promise.resolve(user);
    }
    return UsersManager.fetchUser(userId);
  },

  /**
   * Fetch a user based on user id. Returns a promise
   * @param  {String} userId
   * @return {Promise}
   */
  fetchUser(userId) {
    return ByeBye.ajax({ url: Settings.getLink('user', { user_id: userId }) }).then(
      resp => new User(resp.data, { track: true, parse: true }),
    );
  },

  setAvatarByURL(user, url) {
    return ByeBye.ajax({
      url: `${Settings.getLink('user', { user_id: ByeBye.Helpers.modelId(user) })}/avatars`,
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: `avatar_url=${encodeURIComponent(url)}`,
    }).then(() => Promise.resolve(user));
  },

  /**
   * Resend the confirmation token e-mail for user
   * @param  {Int} userId
   * @param  {Object} payload
   * @return {Promise}
  */
  resendConfirmationEmail(userId, payload = {}) {
    return ByeBye.ajax({
      url: Settings.getLink('user_resend_confirmation_email', { user_id: userId }),
      type: 'POST',
      data: JSON.stringify(payload),
    });
  },

  /**
   * Delete the user, currently (as 05/2017) only for users without orders
   * @param {string} userId
   */
  deleteUser(userId) {
    return ByeBye.ajax({
      url: Settings.getLink('user', { user_id: userId }),
      type: 'DELETE',
    });
  },
};

module.exports = UsersManager;



// WEBPACK FOOTER //
// ./src/js/app/managers/users.js