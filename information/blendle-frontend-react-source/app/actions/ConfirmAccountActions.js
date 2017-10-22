import alt from 'instances/altInstance';
import UsersManager from 'managers/users';
import SignUpManager from 'managers/signup';

const changeEmail = (email, user) =>
  SignUpManager.emailIsAvailable(email).then(() => user.saveProperty('email', email));

class ConfirmAccountActions {
  constructor() {
    this.generateActions(
      'changeEmailSuccess',
      'changeEmailError',
      'resendConfirmationEmailSuccess',
      'resendConfirmationEmailError',
    );
  }

  resetState() {
    return {};
  }

  changeEmail(email, user) {
    changeEmail(email, user)
      .then(() => {
        this.changeEmailSuccess({ email });
      })
      .catch((error) => {
        this.changeEmailError({ error, email });
      });

    return null;
  }

  resendConfirmationEmail(userId, payload = {}) {
    UsersManager.resendConfirmationEmail(userId, payload)
      .then(() => {
        this.resendConfirmationEmailSuccess();
      })
      .catch((error) => {
        this.resendConfirmationEmailError({ error });

        throw error;
      });

    return { userId };
  }
}

export default alt.createActions(ConfirmAccountActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ConfirmAccountActions.js