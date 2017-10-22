import alt from 'instances/altInstance';
import AuthManagers from 'managers/auth';
import UsersManagers from 'managers/users';
import Analytics from 'instances/analytics';
import browserHistory from 'react-router/lib/browserHistory';

function checkStatusCode(err) {
  if (err.status === 401) {
    // Password was not correct
    return false;
  }
  throw err;
}

export default alt.createActions({
  toggleDeleteAccountDialog: nextValue => nextValue,
  nextStep: step => step,

  /**
   * @param {string} reason
   * @returns {string}
   */
  selectReason(reason) {
    return reason;
  },

  passwordFieldChanged: event => event.target.value,

  differentReasonFieldChanged: event => event.target.value,

  /**
   * @param {{ login: string, password: string, reason: string }} options
   * @return {Promise<boolean>} Resolves with bool of password is correct
   */
  deleteAccount({ login, password, reason }) {
    AuthManagers.fetchTokenByCredentials({ login, password })
      .then(() => true)
      .catch(checkStatusCode)
      .then((isPasswordValid) => {
        this.passwordValidationResult(isPasswordValid);

        if (isPasswordValid) {
          UsersManagers.deleteUser(login).then(() => this.deleteAccountSuccess(reason));
        }
      });

    return login;
  },

  deleteAccountSuccess(reason) {
    Analytics.track('delete_user', { reason });

    // goodbye is also the place where the user logs out.
    return browserHistory.push('/goodbye');
  },

  passwordValidationResult: result => result,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/DeleteAccountActions.js