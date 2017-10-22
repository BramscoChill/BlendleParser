import alt from 'instances/altInstance';
import SessionActions from 'actions/SessionActions';

class SessionStore {
  constructor() {
    this.bindActions(SessionActions);

    this.state = {
      data: {},
    };
  }

  onSetItem({ key, value }) {
    this.setState({
      data: {
        ...this.state.data,
        [key]: value,
      },
    });
  }

  onClear() {
    this.setState({
      data: {},
    });
  }
}

export default alt.createStore(SessionStore, 'SessionStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/SessionStore.js