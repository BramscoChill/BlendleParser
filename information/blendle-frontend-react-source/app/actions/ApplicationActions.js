import alt from 'instances/altInstance';
import { STATUS_OK, STATUS_PENDING, STATUS_ERROR } from 'app-constants';

class ApplicationActions {
  statusOk() {
    return { status: STATUS_OK };
  }

  statusPending() {
    return { status: STATUS_PENDING };
  }

  statusError() {
    return { status: STATUS_ERROR };
  }

  set(key, value) {
    return { key, value };
  }
}

export default alt.createActions(ApplicationActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ApplicationActions.js