import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import TwitterActions from 'actions/TwitterActions';
import AuthActions from 'actions/AuthActions';

class TwitterStore {
  status = STATUS_INITIAL;
  errorMessage = null;
  connected = false;
  friends = [];

  constructor() {
    this.bindActions(TwitterActions);
    this.bindAction(AuthActions.UPDATE, this.onUpdateUser);
  }

  onUpdateUser(user) {
    this.setState({
      connected: typeof user.get('twitter_id') === 'string',
    });
  }

  onToggleTwitter() {
    this.setState({
      status: STATUS_PENDING,
      error: null,
    });
  }

  onConnectTwitter() {
    this.setState({
      status: STATUS_PENDING,
      error: null,
    });
  }

  onTwitterError() {
    this.setState({
      status: STATUS_ERROR,
    });
  }

  onTwitterConnectSuccess() {
    this.setState({
      status: STATUS_OK,
    });
  }

  onTwitterDisconnectSuccess() {
    this.setState({
      status: STATUS_OK,
      connected: false,
    });
  }

  onFetchTwitterFriendsSuccess(friends) {
    this.setState({
      friends,
    });
  }
}

export default alt.createStore(TwitterStore, 'TwitterStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/TwitterStore.js