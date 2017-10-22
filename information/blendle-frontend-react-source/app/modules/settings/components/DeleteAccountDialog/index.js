import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { last } from 'lodash';
import classNames from 'classnames';
import {
  Dialog,
  DialogBody,
  ButtonGroup,
  Button,
  Form,
  TextInput,
  PasswordInput,
  RadioGroup,
  Radio,
} from '@blendle/lego';
import StepsPanel from 'components/StepsPanel';
import { translate, formatCurrency } from 'instances/i18n';
import CSS from './styles.scss';

const MAXIMUM_AMOUNT_IN_WALLET_TO_SHOW_BALANCE_NOTICE = 0.5;

function DeleteAccountDialog({
  isLoading,
  dialogOpen,
  activeStepIndex,
  onClose,
  onNextStep,
  onDeleteAccount,
  reasons,
  onSelectReason,
  selectedReason,
  balance,
  passwordFieldChanged,
  passwordField,
  hasWrongPassword,
  differentReasonField,
  differentReasonFieldChanged,
}) {
  const otherReason = last(reasons);

  const isSubmitButtonDisabled =
    !selectedReason || (selectedReason === otherReason && differentReasonField.length < 5);

  return (
    <Dialog
      open={dialogOpen}
      onClose={onClose}
      hideClose={activeStepIndex === 2}
      className={CSS.dialog}
    >
      <DialogBody>
        <StepsPanel activeStepIndex={activeStepIndex} showStepIndicator={false}>
          <Form onSubmit={onNextStep} name="delete-account-reason">
            <h2>{translate('settings.profile.delete_account.reasons.header')}</h2>
            <p>{translate('settings.profile.delete_account.reasons.body')}</p>
            <p>
              <RadioGroup checkedValue={selectedReason} onCheckedValueChange={onSelectReason}>
                {reasons.map(reason => (
                  <Radio
                    key={reason}
                    value={reason}
                    label={translate(`settings.profile.delete_account.reasons.${reason}`)}
                    className={CSS.reason}
                  >
                    {translate(`settings.profile.delete_account.reasons.${reason}`)}
                  </Radio>
                ))}
              </RadioGroup>
            </p>
            {selectedReason === otherReason && (
              <p>
                <TextInput
                  placeholder={`${translate(
                    `settings.profile.delete_account.reasons.${otherReason}`,
                  )}...`}
                  onChange={differentReasonFieldChanged}
                  value={differentReasonField}
                  labelClassName={CSS.otherReasonTextInputLabel}
                  className={CSS.otherReasonTextInput}
                />
              </p>
            )}
            <p>
              <ButtonGroup vertical>
                <Button
                  type="submit"
                  disabled={isSubmitButtonDisabled}
                  className={classNames({
                    [CSS.disabledButton]: isSubmitButtonDisabled,
                  })}
                >
                  {translate('settings.profile.delete_account.reasons.continue')}
                </Button>
                <Button onClick={onClose} color="cappuccino">
                  {translate('settings.profile.delete_account.reasons.cancel')}
                </Button>
              </ButtonGroup>
            </p>
          </Form>
          <Form onSubmit={onDeleteAccount} name="delete-account-password">
            <h2>{translate('settings.profile.delete_account.confirmation.head')}</h2>
            <p>
              {translate('settings.profile.delete_account.confirmation.body_always')}
              {balance > MAXIMUM_AMOUNT_IN_WALLET_TO_SHOW_BALANCE_NOTICE && (
                <span>
                  {' '}
                  {translate(
                    'settings.profile.delete_account.confirmation.body_conditional',
                    formatCurrency(balance),
                  )}
                </span>
              )}
            </p>
            <div>
              {translate('settings.profile.delete_account.confirmation.password_label')}
              <br />
              <PasswordInput
                className={CSS.password}
                labelClassName={CSS.password}
                placeholder={translate('app.user.password')}
                onChange={passwordFieldChanged}
                value={passwordField}
                error={hasWrongPassword}
              />
            </div>
            <ButtonGroup vertical>
              <Button type="submit" isLoading={isLoading}>
                {translate('settings.profile.delete_account.confirmation.continue')}
              </Button>
              <Button onClick={onClose} color="cappuccino" isLoading={isLoading}>
                {translate('settings.profile.delete_account.confirmation.cancel')}
              </Button>
            </ButtonGroup>
          </Form>
        </StepsPanel>
      </DialogBody>
    </Dialog>
  );
}

DeleteAccountDialog.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  activeStepIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
  onSelectReason: PropTypes.func.isRequired,
  reasons: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  selectedReason: PropTypes.string,
  balance: PropTypes.number.isRequired,
  hasWrongPassword: PropTypes.bool,
  isLoading: PropTypes.bool,
  passwordField: PropTypes.string.isRequired,
  passwordFieldChanged: PropTypes.func.isRequired,
  differentReasonField: PropTypes.string.isRequired,
  differentReasonFieldChanged: PropTypes.func.isRequired,
};

export default pure(DeleteAccountDialog);



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/DeleteAccountDialog/index.js