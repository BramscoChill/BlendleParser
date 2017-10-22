import { Model, ajax } from 'byebye';
import _ from 'lodash';
import Settings from 'controllers/settings';
import PreferencesManager from 'managers/preferences';
import stringToBool from 'helpers/stringtobool';
import sanatize from 'helpers/sanatize';
import urlToLink from 'helpers/urlToLink';
import moment from 'moment';

const User = Model.extend({
  allToJSON: true,
  name: 'user',
  mappings: {
    shared_users: {
      resource(resp) {
        const Users = require('collections/users');
        return new Users({ _embedded: { users: resp } }, { parse: true });
      },
    },
    managers: {
      resource(resp) {
        const Users = require('collections/users');
        return new Users({ _embedded: { users: resp } }, { parse: true });
      },
    },
  },
  defaults: {
    _onboardingUserGroups: [],
    _onboardingHidden: true,
    following: false,
    email: '',
    id: '',
    password: '',
    username: '',
    text: '',
    providers_opt_in: false,
    active_subscriptions: [],
    preferences: {},
  },

  required: {
    id: true,
    email: true,
    username: true,
  },

  expressions: {
    login: /^.+$/,
    id: /^[a-z0-9]{2,20}$/,
    email: /^.+@.+\..+$/,
    password: /^.{5,}$/,
    username: /^.+$/,
    text: /^.*$/m,
  },

  // If we post the id to the server it will complain. This flags allows us to only include the id
  // in some cases. Used only in signup right now.
  addIdToJSON: false,

  balancePollInterval: 5000, // miliseconds interval (retry poll)
  balancePollTimeout: 120000, // miliseconds timeout (stop poll)

  toJSON() {
    return this.allToJSON ? this._allToJSON() : this._changesToJSON();
  },

  // the current_password is needed for some changes in the backend.
  // We're not using the normal setter since it updated/modifies
  // the changed state of this model. This doesn't work well if
  // we want to sync/save only changed attributes
  //
  // This password is stored for 30 seconds, after which it is removed.
  setCurrentPassword(password, timeout) {
    if (this._currentPasswordTimeout) {
      clearTimeout(this._currentPasswordTimeout);
    }

    this.attributes.current_password = password;

    this._currentPasswordTimeout = setTimeout(
      this.clearCurrentPassword.bind(this),
      timeout || 30000,
    );
  },

  getCurrentPassword() {
    return this.get('current_password');
  },

  getExperiments() {
    return this.getEmbedded('ab_tests')
      ? Object.values(this.getEmbedded('ab_tests').attributes)
      : [];
  },

  clearCurrentPassword() {
    if (this.attributes.current_password) {
      delete this.attributes.current_password;
    }

    if (this._currentPasswordTimeout) {
      clearTimeout(this._currentPasswordTimeout);
    }
  },

  // We don't actually have a firstname, so we return everything
  // before the first space.
  getFirstName() {
    if (this.get('first_name')) {
      return this.get('first_name');
    }

    const name = this.get('username');
    if (name === null) {
      return '';
    }

    return name.indexOf(' ') !== -1 ? name.substr(0, name.indexOf(' ')) : name;
  },

  getAvatar() {
    const image = { _links: {} };
    let isSet = false;

    if (this.get('links')) {
      if (this.get('links').large_avatar) {
        isSet = true;
        image._links.original = this.get('links').large_avatar;

        if (this._avatarCacheBust) {
          image._links.original.href += `?${this._avatarCacheBust}`;
        }
      }

      if (this.get('links').avatar) {
        isSet = true;
        image._links.small = this.get('links').avatar;

        if (this._avatarCacheBust) {
          image._links.small.href += `?${this._avatarCacheBust}`;
        }
      }
    }

    return isSet ? image : undefined;
  },
  getAvatarHref() {
    const image = this.getAvatar();
    let href;

    if (image) {
      href = image._links[_.keys(image._links)[0]].href;
    }

    return href;
  },

  getAvatarThumbnail() {
    if (this.get('links') && this.get('links').avatar) {
      let href = this.get('links').avatar.href;

      if (this._avatarCacheBust) {
        href += `?${this._avatarCacheBust}`;
      }

      return href;
    }

    return undefined;
  },

  useAvatarUrl(avatarUrl, cb) {
    const uploadUrl = `${Settings.get('links').user.href.replace(
      '{user_id}',
      this.get('id'),
    )}/avatars`;

    ajax({
      url: uploadUrl,
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: `avatar_url=${encodeURIComponent(avatarUrl)}`,
    }).then(
      () => {
        if (cb) {
          cb(true);
        }
      },
      () => {
        if (cb) {
          cb(false);
        }
      },
    );
  },

  // Increase amount of users user follows
  increaseFollowCount(amount) {
    this.set('follows', this.get('follows') + (amount || 1));
  },

  // Increase amount of users user follows
  decreaseFollowCount(amount) {
    this.set('follows', this.get('follows') - (amount || 1));
  },

  updateLastViewedTrendingTime() {
    this.set('trending_viewed_at', moment().toISOString());
  },

  // Set followed
  setFollowed() {
    this.set('following', true);

    this.increaseFollowCount();
  },
  // Set followed
  unsetFollowed() {
    this.set('following', false);

    this.decreaseFollowCount();
  },

  follow(follower, cb) {
    let followerId;

    if (_.isString(follower)) {
      followerId = follower;
    } else {
      followerId = follower.id;
      follower.set('follows', follower.get('follows') + 1);
    }

    this.set('followers', this.get('followers') + 1);
    this.set('following', true);

    ajax({
      url: Settings.getLink('follows', { user_id: followerId }),
      data: JSON.stringify({ id: this.id }),
      type: 'POST',
    })
      .then(() => {
        if (_.isFunction(cb)) {
          cb(true);
        }
      })
      .catch(() => {
        this.set('followers', this.get('followers') - 1);
        this.set('following', false);

        if (!_.isString(follower)) {
          follower.set('follows', follower.get('follows') - 1);
        }

        if (_.isFunction(cb)) {
          cb(false);
        }
      });
  },

  unfollow(follower, cb) {
    const self = this;

    this.set('followers', self.get('followers') - 1);
    this.set('following', false);

    follower.set('follows', follower.get('follows') - 1);

    ajax({
      url: `${Settings.getLink('follows', { user_id: follower.id })}/${this.id}`,
      type: 'DELETE',
    })
      .then(() => {
        if (_.isFunction(cb)) {
          cb(true);
        }
      })
      .catch(() => {
        self.set('followers', self.get('followers') + 1);
        self.set('following', true);

        follower.set('follows', follower.get('follows') + 1);

        if (_.isFunction(cb)) {
          cb(false);
        }
      });
  },

  /**
   * Get the balance for this user
   *
   * @return {Number} Balance
   * @api public
   */
  getBalance() {
    return parseFloat(this.get('balance'));
  },

  /**
   * Set the balance for this user and update mixpanel
   *
   * @param {String} balance
   */
  setBalance(balance) {
    const newBalance = Math.round(parseFloat(balance) * 100) / 100;

    this.set('balance', newBalance);
  },

  /**
   * Subtract {amount} to the balance of this user and return the new balance
   *
   * @api public
   * @param {Float} amount
   * @return {Float} Balance
   */
  subtractFromBalance(amount) {
    return this._changeBalanceBy(amount * -1);
  },

  saveProperty(property, value, cb) {
    let data;
    if (property instanceof Object) {
      data = property;
    } else {
      data = {};
      data[property] = value;
    }

    return ajax({
      url: this.get('links').self.href,
      type: 'POST',
      data: JSON.stringify(data),
    })
      .then(() => {
        this.set(property, value);

        if (cb) {
          cb(true);
        }
        return Promise.resolve(true);
      })
      .catch((err) => {
        if (cb) {
          cb(false);
        }
        return Promise.reject(err);
      });
  },

  get(variable) {
    if (variable === 'balance' && !Model.prototype.get.apply(this, ['email_confirmed'])) {
      return 0;
    }

    return Model.prototype.get.apply(this, arguments);
  },

  /**
   * Preferences are stored in a postgres hstore, which only uses strings. Make sure to
   * only use strings when settings preferences.
   * @param {Object} preferences
   * @return {Promise}
   */
  savePreferences(preferences) {
    // Preferences must be saved all at once (it is one hstore column).
    // Combine old with new preferences.
    return PreferencesManager.save(
      this,
      _.extend(this.get('preferences'), preferences),
    ).then((response) => {
      if (response.data) {
        this.set('preferences', response.data);
      }
    });
  },

  getPreference(preference) {
    // the service returns booleans as a string. try convert them to a boolean
    return stringToBool(this.get('preferences')[preference]);
  },

  /**
   * If the user is a channel moderator
   * @returns {Boolean} isModerator
   */
  isModerator() {
    const sharedUsers = this.getEmbedded('shared_users');
    return !!(sharedUsers && sharedUsers.length);
  },

  /**
   * If the user is a freeloader
   * @returns {Boolean} isFreeloader
   */
  isFreeloader() {
    return this.get('freeloader');
  },

  /**
   * If the user has a valid premium subscription
   * @returns {Boolean} hasActivePremiumSubscription
   */
  hasActivePremiumSubscription() {
    return this.hasActiveSubscription('blendlepremium'); // TODO: don't hardcode
  },

  hasActiveSubscription(subscriptionProviderId) {
    const activeSubscriptions = this.get('active_subscriptions');
    return activeSubscriptions.includes(subscriptionProviderId);
  },

  getLatestPremiumSubscriptionUrl() {
    return this._links['premium-subscription'].href;
  },

  didOnboarding() {
    const didOnboarding = this.getPreference('did_onboarding');
    const hasRead = this.get('reads') > 1;

    return Boolean(didOnboarding || (hasRead && confirmedID));
  },

  _changeBalanceBy(amount) {
    let balance = parseFloat(this.get('balance'));

    balance = Math.round(balance * 100 + amount * 100) / 100;

    this.set('balance', balance);

    return balance;
  },

  _allToJSON() {
    const response = {};

    if (this.addIdToJSON) {
      response.id = this.get('id');
    }

    [
      'username',
      'text',
      'password',
      'email',
      'facebook_id',
      'facebook_access_token',
      'ignore_uids',
      'providers_opt_in',
    ].forEach((attr) => {
      if (this.get(attr)) {
        response[attr] = this.get(attr);
      }
    });

    if (this.getCurrentPassword()) {
      response.current_password = this.getCurrentPassword();
    }

    return response;
  },

  _changesToJSON() {
    const response = {};

    for (const key in this.changed) {
      response[key] = this.get(key);
    }

    if (this.getCurrentPassword()) {
      response.current_password = this.getCurrentPassword();
    }

    return response;
  },

  _formatNum(num) {
    if (num > 9999) {
      return `${Math.round(num / 100) / 10}K`;
    }

    return num;
  },

  getFormattedReads() {
    return this._formatNum(this.get('reads'));
  },

  getFormattedFollowing() {
    return this._formatNum(this.get('follows'));
  },

  getFormattedFollowers() {
    return this._formatNum(this.get('followers'));
  },

  getBioHTML() {
    return urlToLink(sanatize(this.get('text')));
  },
});

export default User;



// WEBPACK FOOTER //
// ./src/js/app/models/user.js