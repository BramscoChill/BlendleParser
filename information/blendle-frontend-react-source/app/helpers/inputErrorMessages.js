import { translate } from 'instances/i18n';
import {
  EMAIL_INVALID,
  EMAIL_EXISTS,
  EMAIL_CONTAINS_PLUS_SIGN,
  EMAIL_BLACKLISTED,
  USER_ID_TAKEN,
  PASSWORD_INVALID,
  FIRST_NAME_INVALID,
} from 'app-constants';

export const emailErrorMessages = {
  [EMAIL_BLACKLISTED]: translate('app.signup.blacklisted_email_warning'),
  [EMAIL_INVALID]: translate('error.invalid_email'),
  [EMAIL_EXISTS]: translate('deeplink.signup.email_exists'),
  [EMAIL_CONTAINS_PLUS_SIGN]: translate('error.invalid_email'),
  [USER_ID_TAKEN]: translate('deeplink.signup.email_exists'),
};

export const nameErrorMessages = {
  [FIRST_NAME_INVALID]: translate('app.error.default_form_field_error'),
};

export const passwordErrorMessages = {
  [PASSWORD_INVALID]: translate('app.error.default_form_field_error'),
};

export const inputErrorMessages = {
  ...emailErrorMessages,
  ...nameErrorMessages,
  ...passwordErrorMessages,
};

/**
 * Get the translated errormessage that corresponds with the error type
 * @param  {String} errorType                         Type of error from failed XHR
 * @param  {Object} [messages=inputErrorMessages]     Object which contains errorkeys with translated messages
 * @param  {Object} [options={ withFallback: false }] Options, like requestin a default fallback error message
 * @return {String | null}
 */
export function getErrorMessage(
  errorType,
  messages = inputErrorMessages,
  options = { withFallback: false },
) {
  if (messages[errorType]) {
    return messages[errorType];
  }

  return options.withFallback ? translate('error.something_went_wrong_retry') : null;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/inputErrorMessages.js