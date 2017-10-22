import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogBody, Button } from '@blendle/lego';
import { translate, translateElement } from 'instances/i18n';
import { providerById, prefillSelector } from 'selectors/providers';
import CSS from './style.scss';

const translateKeys = {
  title: 'settings.subscriptions.quit.title',
  body: 'settings.subscriptions.quit.body',
  confirmBody: 'settings.subscriptions.quit.body_confirm',
  confirmButton: 'settings.subscriptions.quit.dialog_button',
};

const legacyTranslateKeys = {
  title: 'settings.subscriptions.disconnect.title',
  body: 'settings.subscriptions.disconnect.body',
  confirmBody: 'settings.subscriptions.disconnect.body_confirm',
  confirmButton: 'settings.subscriptions.disconnect.dialog_button',
};

class SubscriptionCancelDialog extends PureComponent {
  static propTypes = {
    subscription: PropTypes.object.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    onLegacyCancel: PropTypes.func,
  };

  _onClickCancel = () => {
    const { subscription } = this.props;
    this.props.onClose();

    if (subscription.isLegacy) {
      this.props.onLegacyCancel(subscription);
      return;
    }

    this.props.onCancel(subscription);
  };

  render() {
    const { subscription, isOpen, onClose } = this.props;
    const translations = subscription.isLegacy ? legacyTranslateKeys : translateKeys;
    const providerName = prefillSelector(providerById)(this.props.subscription.provider.uid).name;

    return (
      <Dialog
        className={CSS.dialog}
        data-test-identifier="subscription-cancel"
        onClose={onClose}
        open={isOpen}
      >
        <DialogBody>
          <h2>{translate(translations.title)}</h2>
          {translateElement(<p />, translations.body, [providerName], false)}
          <p>{translate(translations.confirmBody)}</p>

          <Button className="btn-fullwidth" onClick={this._onClickCancel}>
            {translate(translations.confirmButton)}
          </Button>
        </DialogBody>
      </Dialog>
    );
  }
}

export default SubscriptionCancelDialog;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/SubscriptionCancelDialog/index.js