import { uniqBy } from 'lodash';
import alt from 'instances/altInstance';
import AuthController from 'controllers/auth';
import {
  EMAIL_INVALID,
  USER_ID_TAKEN,
  EMAIL_BLACKLISTED,
  EMAIL_CONTAINS_PLUS_SIGN,
  USER_REJECTED_EMAIL,
  FIRST_NAME_INVALID,
  PASSWORD_INVALID,
} from 'app-constants';
import Analytics from 'instances/analytics';
import Country from 'instances/country';
import i18n from 'instances/i18n';
import SignUpManager from 'managers/signup';
import SignUpModel from 'models/blendlesignup';
import TypedError from 'helpers/typederror';
import Dialogues from 'controllers/dialogues';
import { isEmail } from 'helpers/validate';
import axios from 'axios';
import Settings from 'controllers/settings';
import { signUpPayload } from 'selectors/signUp';

function validateSignup(email, context) {
  return new Promise((resolve, reject) => {
    if (context.hasOwnProperty('first_name') && !context.first_name) {
      throw new TypedError(FIRST_NAME_INVALID);
    }

    if (context.hasOwnProperty('password') && (!context.password || context.password.length < 5)) {
      throw new TypedError(PASSWORD_INVALID);
    }

    if (!isEmail(email)) {
      throw new TypedError(EMAIL_INVALID);
    }

    Promise.all([SignUpManager.emailIsAllowed(email), SignUpManager.emailIsAvailable(email)]).then(
      resolve,
      reject,
    );
  });
}

class SignUpActions {
  constructor() {
    this.generateActions(
      'signUpError',
      'resendEmailConfirmSuccess',
      'signUpChangeEmail',
      'addFavorite',
      'removeFavorite',
    );
  }

  signUpSuccess(payload = {}) {
    return (dispatch) => {
      dispatch();

      Analytics.track('Signup/Send Confirmation', payload);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  signUpFormChange({ firstname, email, password }) {
    return { firstname, email, password };
  }

  signUp(email, context, options) {
    return (dispatch) => {
      dispatch({ email });
      validateSignup(email, context)
        .then(() => {
          if (!options.verifyEmail) {
            return Promise.resolve();
          }
          // show 'is this your email' verification dialogue
          return new Promise((resolve, reject) => {
            Dialogues.openVerifyEmail(email, resolve, reject);
          });
        })
        .then(() => {
          // do a signup!
          const signUpUser = new SignUpModel({
            email: email.toLowerCase(),
            country: Country.getCountryCode(),
            primary_language: i18n.currentLocale,
            ...context,
          });

          return SignUpManager.signup(signUpUser, options.signUpType);
        })
        .then((signUpToken) => {
          AuthController.loginWithToken(signUpToken);
          this.signUpSuccess({
            ...signUpPayload(options.signUpType),
            ...options.analyticsPayload,
          });
        })
        .catch((err) => {
          // User clicked on the 'No' button when verifying their own email
          if (err.type && err.type === USER_REJECTED_EMAIL) {
            return this.signUpChangeEmail();
          }

          Analytics.track('Signup/Error', {
            ...signUpPayload(options.signUpType),
            error: err.message || err.type,
          });

          let errType = err.type;

          // map some error types to their counterparts
          if (errType === 'ExistingEmail') {
            errType = USER_ID_TAKEN;
          } else if (errType === 'TemporaryEmailServiceUsed') {
            errType = EMAIL_INVALID;
          }

          if (errType) {
            this.signUpError(errType);
          }

          // Throw for unknown errors
          if (
            ![
              EMAIL_INVALID,
              EMAIL_BLACKLISTED,
              USER_ID_TAKEN,
              EMAIL_CONTAINS_PLUS_SIGN,
              PASSWORD_INVALID,
              FIRST_NAME_INVALID,
            ].includes(errType)
          ) {
            throw err;
          }
        });
    };
  }

  validateUserInfo(email, context) {
    return (dispatch) => {
      dispatch();

      validateSignup(email, context)
        .then(() => this.validateUserInfoSuccess({ email, context }))
        .catch(this.validateUserInfoError);
    };
  }

  validateUserInfoSuccess({ email, context }) {
    return { email, context };
  }

  validateUserInfoError(error) {
    return error;
  }

  extendContext(context) {
    return context;
  }

  resendEmailConfirm(user, context, analyticsName = 'SignUp') {
    return (dispatch) => {
      dispatch();

      Analytics.track(analyticsName, {
        event: 'Signup/Resend Confirmation',
      });

      SignUpManager.resendEmailConfirmation(user, context).then(() =>
        this.resendEmailConfirmSuccess(),
      );
    };
  }

  fetchPublicationsByChannelPreferences(channels) {
    const url = Settings.getLink('b:issues-by-channel-preferences', {
      channel_uid: channels.join(','),
      amount: 250,
    });

    axios
      .get(url, {
        headers: {
          accept: 'application/hal+json',
        },
      })
      .then((res) => {
        const dedupedPublicationsList = uniqBy(
          res.data._embedded.issues,
          issue => issue.provider.id,
        );
        this.fetchPublicationsByChannelPreferencesSuccess(dedupedPublicationsList);
      });

    return null;
  }

  fetchPublicationsByChannelPreferencesSuccess(publications) {
    return { publications };
  }

  setSignupPlatform = platform => platform;
}

export default alt.createActions(SignUpActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/SignUpActions.js