import altConnect from 'higher-order-components/altConnect';
import DeleteAccountActions from 'actions/DeleteAccountActions';
import DeleteAccountStore from 'stores/DeleteAccountStore';
import AuthStore from 'stores/AuthStore';
import DeleteAccountDialog from '../components/DeleteAccountDialog';

// these are the translation and event keys
const reasons = [
  'dont_use',
  'not_enough_time',
  'too_expensive',
  'too_many_emails',
  'payment_for_journalism_not_necessary',
  'create_by_accident',
  'other_account',
  'different_reason',
];

function deleteUserIfPasswordMatch() {
  const { passwordField, selectedReason, differentReasonField } = DeleteAccountStore.getState();
  const { user } = AuthStore.getState();

  const reason = selectedReason === 'different_reason' ? differentReasonField : selectedReason;

  return DeleteAccountActions.deleteAccount({
    login: user.id,
    password: passwordField,
    reason,
  });
}

function mapStateToProps({ deleteAccountState, authState }) {
  const { user: { attributes: { balance } } } = authState;
  return {
    ...deleteAccountState,
    reasons,
    balance,
  };
}
mapStateToProps.stores = { DeleteAccountStore, AuthStore };

const actions = {
  onNextStep: DeleteAccountActions.nextStep,
  onDeleteAccount: deleteUserIfPasswordMatch,
  onClose: DeleteAccountActions.toggleDeleteAccountDialog,
  onSelectReason: DeleteAccountActions.selectReason,
  passwordFieldChanged: DeleteAccountActions.passwordFieldChanged,
  differentReasonFieldChanged: DeleteAccountActions.differentReasonFieldChanged,
};

export default altConnect(mapStateToProps, actions)(DeleteAccountDialog);



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/DeleteAccountDialogContainer.js