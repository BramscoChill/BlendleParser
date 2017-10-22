import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Notification,
  NotificationTitle,
  NotificationBody,
  NotificationFooter,
} from '@blendle/lego';
import { isMobileBreakpoint } from 'helpers/viewport';
import { translate } from 'instances/i18n';
import CSS from './styles.scss';

class AutoRefundNotification extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired,
    isPinned: PropTypes.bool.isRequired,
    limitReached: PropTypes.bool.isRequired,
    onPin: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onDisagree: PropTypes.func.isRequired,
  };

  _renderRefundLimitButtons() {
    const { onClose, onDisagree } = this.props;
    const disagreeColor = isMobileBreakpoint() ? 'white' : 'transparent';
    const confirmButton = (
      <Button color="cash-green" size="small" className={CSS.agree} onClick={onClose} key="getit">
        {translate('app.buttons.i_get_it')}
      </Button>
    );
    const disagreeButton = (
      <Button color={disagreeColor} size="small" onClick={onDisagree} key="disagree">
        {translate('refund.account_limit_notice.button_disagree')}
      </Button>
    );

    return [confirmButton, disagreeButton];
  }

  _renderRegularButtons() {
    const { isPinned, onPin, onClose } = this.props;
    const confirmColor = isMobileBreakpoint() ? 'white' : 'transparent';
    const confirmButton = (
      <Button
        color={confirmColor}
        size="small"
        onClick={onClose}
        key="supersympathiek"
        data-test-identifier="auto-refund-close-button"
      >
        {translate('refund.statusses.close_within_x.button')}
      </Button>
    );
    const pinButton = (
      <Button
        className={CSS.pinButton}
        color="cash-green"
        size="small"
        onClick={onPin}
        key="pin"
        data-test-identifier="auto-refund-pin-button"
      >
        {translate('refund.buttons.pin')}
      </Button>
    );

    return isPinned ? confirmButton : [pinButton, confirmButton];
  }

  render() {
    const { title, message, limitReached } = this.props;
    const buttons = limitReached ? this._renderRefundLimitButtons() : this._renderRegularButtons();

    return (
      <Notification data-test-identifier="notification-auto-refund">
        <NotificationTitle>{title}</NotificationTitle>
        <NotificationBody>{message}</NotificationBody>
        <NotificationFooter>{buttons}</NotificationFooter>
      </Notification>
    );
  }
}

export default AutoRefundNotification;



// WEBPACK FOOTER //
// ./src/js/app/components/notifications/AutoRefundNotification/index.js