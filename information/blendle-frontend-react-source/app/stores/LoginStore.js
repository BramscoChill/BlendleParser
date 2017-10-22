import alt from 'instances/altInstance';
import LoginActions from '../actions/LoginActions';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';

class LoginStore {
  constructor() {
    this.bindActions(LoginActions);

    this.state = {
      // login process state
      login: {
        status: STATUS_INITIAL,
      },

      // login email is the 'magic email login'
      loginEmail: {
        status: STATUS_INITIAL,
      },
    };
  }

  onSetEmail(email) {
    this.setState({
      login: { email },
    });
  }

  onLoginWithCredentials() {
    this.setState({
      login: { status: STATUS_PENDING },
      loginEmail: { status: STATUS_INITIAL },
    });
  }

  onLoginSuccess() {
    this.setState({
      login: { status: STATUS_OK },
    });
  }

  onLoginError(error) {
    this.setState({
      login: { status: STATUS_ERROR, error },
    });
  }

  onSendLoginEmailSuccess() {
    this.setState({
      loginEmail: { status: STATUS_OK },
    });
  }

  onSendLoginEmailError(error) {
    this.setState({
      loginEmail: { status: STATUS_ERROR, error },
    });
  }
}

export default alt.createStore(LoginStore, 'LoginStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/LoginStore.js