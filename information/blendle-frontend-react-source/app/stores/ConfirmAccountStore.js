import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import ConfirmAccountActions from 'actions/ConfirmAccountActions';

class ConfirmAccountStore {
  constructor() {
    this.bindActions(ConfirmAccountActions);

    this.state = {
      status: STATUS_INITIAL,
      email: null,
      changeEmailStatus: STATUS_INITIAL,
      resendStatus: STATUS_INITIAL,
    };
  }

  onResetState() {
    this.setState({
      status: STATUS_INITIAL,
      changeEmailStatus: STATUS_INITIAL,
      resendStatus: STATUS_INITIAL,
      email: null,
      error: null,
    });
  }

  onChangeEmail() {
    this.setState({
      changeEmailStatus: STATUS_PENDING,
    });
  }

  onChangeEmailSuccess({ email }) {
    this.setState({
      changeEmailStatus: STATUS_OK,
      error: null,
      email,
    });
  }

  onChangeEmailError({ error, email }) {
    this.setState({
      changeEmailStatus: STATUS_ERROR,
      error,
      email,
    });
  }

  onResendConfirmationEmail() {
    this.setState({
      resendStatus: STATUS_PENDING,
    });
  }

  onResendConfirmationEmailSuccess() {
    this.setState({
      resendStatus: STATUS_OK,
      error: null,
    });
  }

  onResendConfirmationEmailError({ error }) {
    this.setState({
      resendStatus: STATUS_ERROR,
      error,
    });
  }
}

export default alt.createStore(ConfirmAccountStore, 'ConfirmAccountStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ConfirmAccountStore.js