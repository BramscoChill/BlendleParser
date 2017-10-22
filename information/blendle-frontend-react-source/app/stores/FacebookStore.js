import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import FacebookActions from 'actions/FacebookActions';
import AuthActions from 'actions/AuthActions';

class FacebookStore {
  status = STATUS_INITIAL;
  connected = false;
  friends = [];
  error = null;

  constructor() {
    this.bindActions(FacebookActions);
    this.bindAction(AuthActions.UPDATE, this.onUpdateUser);
  }

  onUpdateUser(user) {
    this.setState({ connected: !!user.get('facebook_id') });
  }

  onToggleFacebook() {
    this.setState({
      status: STATUS_PENDING,
      error: null,
    });
  }

  onConnectFacebook() {
    this.setState({
      status: STATUS_PENDING,
      error: null,
    });
  }

  onFacebookError() {
    this.setState({
      status: STATUS_ERROR,
    });
  }

  onFacebookConnectSuccess(friends) {
    this.setState({
      status: STATUS_OK,
      error: null,
      connected: true,
      friends,
    });
  }

  onFacebookDisconnectSuccess() {
    this.setState({
      status: STATUS_OK,
      error: null,
      connected: false,
    });
  }

  onLoginAndConnectFacebook() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onLoginAndConnectFacebookError(error) {
    this.setState({
      status: STATUS_ERROR,
      error,
    });
  }
}

export default alt.createStore(FacebookStore, 'FacebookStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/FacebookStore.js