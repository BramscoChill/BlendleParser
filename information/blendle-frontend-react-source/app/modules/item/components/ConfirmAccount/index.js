import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blendle/lego';
import { STATUS_OK, STATUS_INITIAL } from 'app-constants';
import { translate, translateElement } from 'instances/i18n';
import Dialog from 'components/dialogues/Dialogue';
import ChangeEmailForm from 'components/forms/ChangeEmailForm';
import ResendDialog from '../ResendDialog';
import CSS from './styles.scss';

class ConfirmAccount extends PureComponent {
  static propTypes = {
    email: PropTypes.string.isRequired,
    showEdit: PropTypes.bool.isRequired,
    confirmAccountStore: PropTypes.object.isRequired,
    onClickEdit: PropTypes.func.isRequired,
    onCloseEdit: PropTypes.func.isRequired,
    onClickDismiss: PropTypes.func.isRequired,
    onClickResend: PropTypes.func.isRequired,
    onChangeEmail: PropTypes.func.isRequired,
    error: PropTypes.object,
  };

  // eslint-disable-next-line consistent-return
  _onClickMessage(e) {
    e.preventDefault();

    // Check for clicks on links in OneSky phrase
    if (e.target.classList.contains('resend-confirm-mail')) {
      return this.props.onClickResend();
    }

    if (e.target.classList.contains('change-mail')) {
      return this.props.onClickEdit();
    }
  }

  _renderChangeEmailDialog() {
    const confirmStore = this.props.confirmAccountStore;

    if (!this.props.showEdit || confirmStore.changeEmailStatus === STATUS_OK) {
      return null;
    }

    return (
      <Dialog className="change-mail" onClose={this.props.onCloseEdit}>
        <ChangeEmailForm
          email={confirmStore.email || this.props.email}
          onSubmit={this.props.onChangeEmail}
          error={this.props.error}
        />
      </Dialog>
    );
  }

  _renderResendDialog() {
    const confirmStore = this.props.confirmAccountStore;
    if (confirmStore.resendStatus !== STATUS_INITIAL) {
      return (
        <ResendDialog
          email={this.props.email}
          onClose={this.props.onClickDismiss}
          error={this.props.error}
        />
      );
    }

    return null;
  }

  render() {
    return (
      <div className={CSS.container} data-test-identifier="unconfirmed-account-message">
        <div className={CSS.body}>
          <h1>{translate('app.text.unconfirmed_account_title')}</h1>
          <p className={CSS.copy}>
            {translateElement(
              <span onClick={e => this._onClickMessage(e)} />,
              'app.text.unconfirmed_account',
              [this.props.email],
              false,
            )}
            <Button onClick={this.props.onClickDismiss} className={CSS.confirm}>
              {translate('app.buttons.i_get_it')}
            </Button>
          </p>
        </div>
        {this._renderResendDialog()}
        {this._renderChangeEmailDialog()}
      </div>
    );
  }
}

export default ConfirmAccount;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ConfirmAccount/index.js