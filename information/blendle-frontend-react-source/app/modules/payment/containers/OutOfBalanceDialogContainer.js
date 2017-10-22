import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import { HOME_ROUTE } from 'app-constants';
import withRouter from 'react-router/lib/withRouter';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import Analytics from 'instances/analytics';
import { isTrial, isActive } from 'selectors/subscriptions';
import { isEligibleForTrial } from 'selectors/premiumSubscriptions';
import OutOfBalanceDialog from 'modules/payment/components/OutOfBalanceDialog';

class OutOfBalanceDialogContainer extends PureComponent {
  static propTypes = {
    onDialogClosed: PropTypes.func.isRequired,
    successUrl: PropTypes.string,
    router: PropTypes.object,
    route: PropTypes.object,
  };

  static defaultProps = {
    successUrl: `${HOME_ROUTE}/verified`,
  };

  componentDidMount() {
    Analytics.track('Insufficient Balance Alert Shown');
  }

  _renderDialog = (premiumSubscriptionState) => {
    const { subscription } = premiumSubscriptionState;
    const hasPaidSubscription = subscription && isActive(subscription) && !isTrial(subscription);

    const premiumUrl = isEligibleForTrial(premiumSubscriptionState)
      ? '/premium-intro'
      : '/subscription/blendlepremium';

    return (
      <OutOfBalanceDialog
        onClose={this.props.onDialogClosed}
        hasPremiumSubscription={hasPaidSubscription}
        premiumUrl={premiumUrl}
        successUrl={this.props.successUrl}
      />
    );
  };

  render() {
    return <AltContainer store={PremiumSubscriptionStore} render={this._renderDialog} />;
  }
}

export default withRouter(OutOfBalanceDialogContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/containers/OutOfBalanceDialogContainer.js