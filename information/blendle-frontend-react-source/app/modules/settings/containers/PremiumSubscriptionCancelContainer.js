import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CancelPremium from '../components/CancelPremium';
import NotificationsActions from 'actions/NotificationsActions';
import PremiumCanceledNotification from 'components/notifications/PremiumCanceledNotification';

const REASON_OTHER = 'other';

const REASONS = [
  {
    value: 'expected_unlimited_reading',
    label: 'Ik dacht dat ik onbeperkt kon lezen',
  },
  {
    value: 'prefer_micropayments',
    label: 'Ik vind het fijner om per artikel te betalen',
  },
  {
    value: 'price_high',
    label: 'Ik vind het toch te duur',
  },
  {
    value: 'selection_not_good_enough',
    label: 'De selectie van artikelen sloot niet aan bij mijn interesses',
  },
  {
    value: REASON_OTHER,
    label: 'Anders, namelijk...',
  },
];

const isSelectableReason = selectedReason =>
  !!REASONS.find(({ value }) => value === selectedReason);

export default class PremiumSubscriptionCancelContainer extends Component {
  static propTypes = {
    onUpdateReason: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onCancelSubscription: PropTypes.func.isRequired,
    subscription: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedReason: null,
    };
  }

  _onCancel = () => {
    const subscription = this.props.subscription;
    const endDate = subscription.endDate.format('D MMMM YYYY');

    NotificationsActions.showNotification(
      PremiumCanceledNotification,
      { endDate },
      `cancel-${subscription.uid}`,
    );

    this.props.onCancelSubscription();
  };

  _onSelectReason = (selectedReason) => {
    // When a users selects the REASON_OTHER reason, they see a textarea which they can use to send
    // a custom reason. These reasons should be propagated to the upper components, but should not
    // effect the selectedReason state
    if (isSelectableReason(selectedReason)) {
      this.setState({ selectedReason });
    }

    this.props.onUpdateReason(selectedReason);
  };

  render() {
    return (
      <CancelPremium
        selectableReasons={REASONS}
        selectedReason={this.state.selectedReason}
        showOtherField={this.state.selectedReason === REASON_OTHER}
        onDismiss={this.props.onDismiss}
        onCancelSubscription={this._onCancel}
        onUpdateReason={this._onSelectReason}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/containers/PremiumSubscriptionCancelContainer.js