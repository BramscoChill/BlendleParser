import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { STATUS_INITIAL, STATUS_PENDING } from 'app-constants';
import { translate } from 'instances/i18n';
import zendesk from 'instances/zendesk';
import ItemActions from 'actions/ItemActions';
import RefundStore from 'stores/RefundStore';
import AuthStore from 'stores/AuthStore';
import AutoRefundNotification from 'components/notifications/AutoRefundNotification';

const refundLimitReached = error => error === 'refund_account_limit';

export default class AutoRefundContainer extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    isPinned: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  _onPin = () => {
    const { item } = this.props;
    const { user } = AuthStore.getState();

    ItemActions.pinItem(user, item, true, {});
    this.props.onClose();
  };

  _onDisagree = () => {
    zendesk.execute('activate');
    this.props.onClose();
  };

  _renderTitle(error) {
    const title = refundLimitReached(error)
      ? 'refund.account_limit_notice.title'
      : 'refund.statusses.close_within_x.title';

    return translate(title);
  }

  _renderMessage(error) {
    if (refundLimitReached(error)) {
      return [
        <p>{translate('refund.account_limit_notice.message')}</p>,
        <p>{translate('refund.account_limit_notice.question')}</p>,
      ];
    }

    return translate('refund.statusses.close_within_x.message');
  }

  _renderRefundNotification = ({ error, status }) => {
    const { isPinned, onClose } = this.props;

    if ([STATUS_INITIAL, STATUS_PENDING].includes(status)) {
      return null;
    }

    const title = this._renderTitle(error);
    const message = this._renderMessage(error);

    return (
      <AutoRefundNotification
        title={title}
        message={message}
        isPinned={isPinned}
        limitReached={refundLimitReached(error)}
        onPin={this._onPin}
        onClose={onClose}
        onDisagree={this._onDisagree}
      />
    );
  };

  render() {
    return <AltContainer store={RefundStore} render={this._renderRefundNotification} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/AutoRefundContainer.js