export const emailRegex = /^([\w+-.%]+@[\w-.]+\.[A-Za-z]{2,}(\s*(;|,)\s*|\s*))$/;

/**
 * Checks if the given string is a valid email address
 * @param {string} email - The email string to validate
 * @returns {boolean}
 */
export function isEmail(email) {
  return emailRegex.test(email.trim());
}

/**
 * Check if every email in the given string is valid
 * @param {string} emails - The string of emails to validate
 * @returns {boolean}
 */
export function isMultipleEmails(emails) {
  const splittedEmails = emails.split(/[,;\s]+/).filter(Boolean);
  return splittedEmails.every(isEmail);
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/validate.js