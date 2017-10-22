import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SubscriptionCard from './SubscriptionCard';
import SubscriptionCancelDialog from '../components/SubscriptionCancelDialog';
import SubscriptionDetailsDialog from './SubscriptionDetailsDialog';

class SubscriptionsList extends PureComponent {
  static propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedSubscription: PropTypes.object,
    onCancel: PropTypes.func,
    onLegacyCancel: PropTypes.func,
    onClickMoreInfo: SubscriptionCard.propTypes.onClickMoreInfo,
    onClickUpsell: SubscriptionCard.propTypes.onClickUpsell,
    onCloseDetails: SubscriptionDetailsDialog.propTypes.onDismiss,
    onUpdateReason: SubscriptionDetailsDialog.propTypes.onUpdateReason,
  };

  state = {
    showDialog: false,
  };

  _onClickCardButton = (subscription, dialogType) => {
    this.setState({ showDialog: true, dialogType, subscription });
  };

  _onClose = () => {
    this.setState({ showDialog: false });
  };

  _renderSubscriptions() {
    return this.props.subscriptions.map(subscription => (
      <SubscriptionCard
        subscription={subscription}
        onClickCancelButton={this._onClickCardButton}
        onClickUpsell={this.props.onClickUpsell}
        onClickMoreInfo={this.props.onClickMoreInfo}
        key={subscription.uid}
      />
    ));
  }

  _renderDisconnectDialog() {
    if (!this.state.showDialog) {
      return null;
    }

    return (
      <SubscriptionCancelDialog
        subscription={this.state.subscription}
        onClose={this._onClose}
        onCancel={this.props.onCancel}
        onLegacyCancel={this.props.onLegacyCancel}
      />
    );
  }

  _renderDetailDialog() {
    const { selectedSubscription } = this.props;
    if (!selectedSubscription) {
      return null;
    }

    return (
      <SubscriptionDetailsDialog
        subscription={selectedSubscription}
        onDismiss={this.props.onCloseDetails}
        onCancelSubscription={this.props.onCancel}
        onUpdateReason={this.props.onUpdateReason}
      />
    );
  }

  render() {
    return (
      <div className="v-subscriptions-list">
        {this._renderSubscriptions()}
        {this._renderDisconnectDialog()}
        {this._renderDetailDialog()}
      </div>
    );
  }
}

export default SubscriptionsList;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/SubscriptionsList.js