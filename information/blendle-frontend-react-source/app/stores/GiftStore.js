import alt from 'instances/altInstance';
import GiftActions from 'actions/GiftActions';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';

class GiftStore {
  data = {};
  error = null;
  status = STATUS_INITIAL;
  code = null;
  isFocussed = false;

  constructor() {
    this.bindActions(GiftActions);
  }

  onRedeem() {
    this.setState({ status: STATUS_PENDING });
  }

  onRedeemSuccess(data) {
    this.setState({
      data,
      status: STATUS_OK,
    });
  }

  onRedeemError(error) {
    this.setState({
      error,
      status: STATUS_ERROR,
    });
  }

  onSetCode(code) {
    this.setState({ code });
  }

  onSetFocus({ isFocussed }) {
    this.setState({ isFocussed });
  }
}

export default alt.createStore(GiftStore, 'GiftStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/GiftStore.js