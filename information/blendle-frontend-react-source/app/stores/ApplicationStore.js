import { STATUS_OK } from 'app-constants';
import alt from 'instances/altInstance';
import ApplicationActions from 'actions/ApplicationActions';

class ApplicationStore {
  constructor() {
    this.bindListeners({
      onStatusChange: [ApplicationActions.statusOk, ApplicationActions.statusPending],
      onSet: ApplicationActions.set,
    });

    this.state = {
      status: STATUS_OK,
    };
  }

  onStatusChange({ status }) {
    this.setState({ status });
  }

  onSet({ key, value }) {
    this.setState({
      [key]: value,
    });
  }
}

export default alt.createStore(ApplicationStore, 'ApplicationStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ApplicationStore.js