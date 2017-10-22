import alt from 'instances/altInstance';
import DeleteAccountActions from 'actions/DeleteAccountActions';

const defaultValues = {
  isLoading: false,
  dialogOpen: false,
  activeStepIndex: 0,
  selectedReason: undefined,
  differentReasonField: '',
  passwordField: '',
  hasWrongPassword: false,
};

class DeleteAccountStore {
  state = { ...defaultValues };

  constructor() {
    this.bindActions(DeleteAccountActions);
  }

  toggleDeleteAccountDialog() {
    this.setState({
      ...defaultValues,
      dialogOpen: !this.state.dialogOpen,
    });
  }

  nextStep() {
    this.setState({
      activeStepIndex: this.state.activeStepIndex + 1,
    });
  }

  selectReason(selectedReason) {
    this.setState({ selectedReason });
  }

  passwordFieldChanged(passwordField) {
    this.setState({ passwordField });
  }

  differentReasonFieldChanged(differentReasonField) {
    this.setState({ differentReasonField });
  }

  deleteAccount() {
    this.setState({
      isLoading: true,
      hasWrongPassword: false,
    });
  }

  deleteAccountSuccess() {
    this.setState({
      isLoading: false,
      dialogOpen: false,
    });
  }

  deleteAccountFailed() {
    this.setState({
      isLoading: false,
    });
  }

  passwordValidationResult(isPasswordValid) {
    this.setState({
      hasWrongPassword: !isPasswordValid,
      isLoading: isPasswordValid,
    });
  }
}

export default alt.createStore(DeleteAccountStore, 'DeleteAccountStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/DeleteAccountStore.js