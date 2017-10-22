import { STATUS_INITIAL, STATUS_OK } from 'app-constants';
import alt from 'instances/altInstance';
import AuthActions from 'actions/AuthActions';

class AuthStore {
  constructor() {
    this.bindActions(AuthActions);

    this.state = {
      status: STATUS_INITIAL,
      user: null,
    };
  }

  onAuthenticateUser(user) {
    this.setState({
      status: STATUS_OK,
      user,
    });
  }

  onLogout() {
    this.setState({
      status: STATUS_INITIAL,
      user: null,
    });
  }

  onUpdate(user) {
    this.setState({
      status: STATUS_OK,
      user,
    });
  }

  onUserInputChange(userInput) {
    this.setState({ userInput });
  }

  onFetchUserSuccess(user) {
    this.setState({ user });
  }
}

export default alt.createStore(AuthStore, 'AuthStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/AuthStore.js