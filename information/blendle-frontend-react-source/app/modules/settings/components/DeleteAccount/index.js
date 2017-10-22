import React from 'react';
import { Button } from '@blendle/lego';
import DeleteAccountActions from 'actions/DeleteAccountActions';
import { translate } from 'instances/i18n';
import DeleteAccountDialogContainer from '../../containers/DeleteAccountDialogContainer';
import CSS from './style.scss';

function DeleteAccount() {
  return (
    <div className={CSS.deleteAccount}>
      <div className={CSS.action}>
        <Button
          size="small"
          color="transparent"
          className={CSS.button}
          onClick={DeleteAccountActions.toggleDeleteAccountDialog}
        >
          {translate('settings.profile.delete_account.action')}
        </Button>
      </div>
      <DeleteAccountDialogContainer />
    </div>
  );
}

export default DeleteAccount;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/DeleteAccount/index.js