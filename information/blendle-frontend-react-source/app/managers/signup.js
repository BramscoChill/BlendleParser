import TypedError from 'helpers/typederror';
import ByeBye from 'byebye';
import Settings from 'controllers/settings';
import Token from 'models/token';
import ApplicationState from 'instances/application_state';
import {
  EMAIL_EXISTS,
  EMAIL_BLACKLISTED,
  EMAIL_CONTAINS_PLUS_SIGN,
  USER_ID_TAKEN,
  EMAIL_INVALID,
} from 'app-constants';
import Analytics from 'instances/analytics';
import Environment from 'environment';
import { isPremiumSignUp, signUpPayload } from 'selectors/signUp';

const signUpPayloadFromData = ({ coupon_code: coupon, entry_item: item_id }) => ({
  coupon,
  item_id,
});

const SignupManager = {
  _errors: {
    'Id already exists': { type: USER_ID_TAKEN, message: 'Provided ID for user already exists' },
    'email blank': { type: EMAIL_INVALID, message: 'Provided e-mail address is blank' },
    'invalid email': { type: EMAIL_INVALID, message: 'Provided e-mail address is invalid' },
    'Email already exists': {
      type: EMAIL_EXISTS,
      message: 'Provided e-mail address already exists',
    },
    'id too long': { type: 'IDTooLong', message: 'ID is too long' },
    'Temporary email service detected': {
      type: 'TemporaryEmailServiceUsed',
      message: 'Temporary email service detected',
    },
    'Facebook id already exists': {
      type: 'FacebookIDTaken',
      message: 'Facebook ID already exists',
    },
    'email not allowed': { type: EMAIL_INVALID, message: 'Provided e-mail address is invalid' },
  },

  /**
   * Check the availability of the e-mail, convenience method
   * that is more explicit to call but does the same as
   * SignupManager.userIdIsAvailable.
   * @param  {String} email
   * @return {Promise}
   */
  emailIsAvailable(email) {
    return this.userIdIsAvailable(email.trim().toLowerCase());
  },

  /**
   * check if the email domain is not blacklisted
   * @param {String} email
   * @return {Promise}
   */
  emailIsAllowed(email) {
    const emailName = email
      .split('@')[0]
      .trim()
      .toLowerCase();
    const emailDomain = email
      .split('@')[1]
      .trim()
      .toLowerCase();

    if (emailName.indexOf('+') !== -1 && emailDomain.split('.')[0] !== 'blendle') {
      Analytics.track('SignUp', {
        event: 'signup_error',
        message: 'plus sign in email',
      });

      return Promise.reject(new TypedError(EMAIL_CONTAINS_PLUS_SIGN, 'Email is not allowed'));
    }

    if (Environment.name === 'test') {
      return Promise.resolve(email);
    }

    return ByeBye.ajax({
      url: 'https://static.blendle.com/blacklisted_domains.json',
    }).then((response) => {
      const match = response.data.find(domain => emailDomain === domain.toLowerCase());

      if (!match) {
        return email;
      }

      Analytics.track('SignUp', {
        event: 'signup_error',
        message: 'blacklisted domain',
      });

      return Promise.reject(new TypedError(EMAIL_BLACKLISTED, 'Email is not allowed'));
    });
  },

  /**
   * Check if the user ID is available
   * @param  {String} userId
   * @return {Promise}
   */
  userIdIsAvailable(userId) {
    return ByeBye.ajax({
      url: `${Settings.getLink('user', { user_id: userId })}?q=exists`,
    }).then(
      () => Promise.reject(new TypedError(USER_ID_TAKEN, 'User ID Unavailable')),
      () => Promise.resolve(userId),
    );
  },

  /**
   * Signup the user return a promise with user
   * @param  {BlendlSignup|FacebookSignup} model
   * @return {Promise}
   */
  signup(model, signUpType) {
    let data = '';

    // signUpCode is in the ApplicationState if user comes from accesspage
    if (ApplicationState.get('signUpCode')) {
      data = ApplicationState.get('signUpCode').exportForSignUp(model);
    } else {
      data = model.toJSON();
    }

    return ByeBye.ajax({
      url: Settings.getLink('users'),
      type: 'POST',
      data: JSON.stringify({
        referrer: window.document.referrer,
        ...data,
      }),
    })
      .then(resp => SignupManager._constructToken(resp))
      .then((token) => {
        Analytics.signup(token.getEmbedded('user'), {
          ...signUpPayloadFromData(data),
          ...signUpPayload(signUpType),
        });

        if (isPremiumSignUp(data)) {
          Analytics.trackUserPremiumSignup();
        }

        return token;
      })
      .catch((err) => {
        const errorMessage = err.data && err.data.message;
        const error = SignupManager._errors[errorMessage];

        if (err.status === 422 && error) {
          throw new TypedError(error.type, error.message, err);
        }

        throw err;
      });
  },

  /**
   * Consume confirmation token and return a promise with user
   * @param  {String} confirmationToken
   * @return {Promise}
   */
  confirmEmail(confirmationToken) {
    return ByeBye.ajax({
      url: Settings.getLink('confirm_email', { token: confirmationToken }),
      type: 'GET',
    }).then(
      resp => Promise.resolve(new Token(resp.data, { parse: true, track: true })),
      (err) => {
        if (err.status === 404) {
          return Promise.reject(
            new TypedError('ConfirmationTokenDoesNotExist', "Confirmation token doesn't exist"),
          );
        }
        return Promise.reject(
          new TypedError('InvalidConfirmationToken', 'Invalid confirmation token provided'),
        );
      },
    );
  },

  /**
   * Resend the confirmation token e-mail for user
   * @param  {User} user
   * @param  {object} [context={}]
   * @return {Promise}
   */
  resendEmailConfirmation(user, context = {}) {
    return ByeBye.ajax({
      url: Settings.getLink('user_resend_confirmation_email', {
        user_id: ByeBye.Helpers.modelId(user),
      }),
      type: 'POST',
      data: JSON.stringify(context),
    });
  },

  getSignUpRewards(userId) {
    return ByeBye.ajax({
      url: Settings.getLink('signup_rewards', { user_id: userId }),
      type: 'get',
    }).then(res => res.data.rewards);
  },

  _constructToken(resp) {
    return new Token(resp.data, { parse: true, track: true });
  },
};

export default SignupManager;



// WEBPACK FOOTER //
// ./src/js/app/managers/signup.js