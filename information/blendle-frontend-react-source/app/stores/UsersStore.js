import { STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import UserActions from '../actions/UserActions';

class UsersStore {
  details = {};

  constructor() {
    this.bindActions(UserActions);
  }

  onFetchUserDetails({ userId }) {
    this.setState({
      details: {
        ...this.details,
        [userId]: {
          data: {},
          ...this.details[userId],
          status: STATUS_PENDING,
        },
      },
    });
  }

  onFetchUserDetailsSuccess({ userId, data }) {
    this.setState({
      details: {
        ...this.details,
        [userId]: {
          status: STATUS_OK,
          data,
        },
      },
    });
  }

  onFetchUserDetailsError({ userId, error }) {
    this.setState({
      details: {
        ...this.details,
        [userId]: {
          status: STATUS_ERROR,
          error,
        },
      },
    });
  }
}

export default alt.createStore(UsersStore, 'UsersStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/UsersStore.js