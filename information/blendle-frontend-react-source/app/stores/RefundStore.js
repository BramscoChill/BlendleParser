import { STATUS_INITIAL, STATUS_OK, STATUS_PENDING, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import RefundActions from 'actions/RefundActions';

class RefundStore {
  constructor() {
    this.bindActions(RefundActions);

    this.state = {
      dialogOpen: false,
      ...this.getInitialState(),
    };
  }

  getInitialState() {
    return {
      status: STATUS_INITIAL,
      item: null,
      reason: null,
      reasons: [],
      message: null,
    };
  }

  onToggleRefundDialog() {
    this.setState({ dialogOpen: !this.state.dialogOpen });
  }

  onResetState() {
    this.setState({ ...this.getInitialState() });
  }

  onSetReason(reason) {
    let reasons = this.state.reasons;
    if (!reasons.includes(reason)) {
      reasons = [reason, ...this.state.reasons];
    }

    this.setState({
      reasons,
      reason,
    });
  }

  onSetPossibleReasons(reasons) {
    this.setState({ reasons });
  }

  onSetMessage(message) {
    this.setState({ message });
  }

  onRefundItem(item) {
    this.setState({
      status: STATUS_PENDING,
      item,
    });
  }

  onRefundItemSuccess() {
    this.setState({
      status: STATUS_OK,
    });
  }

  onRefundItemError({ error }) {
    this.setState({
      status: STATUS_ERROR,
      error,
    });
  }
}

export default alt.createStore(RefundStore, 'RefundStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/RefundStore.js