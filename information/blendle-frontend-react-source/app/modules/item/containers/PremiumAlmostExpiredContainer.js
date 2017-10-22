import React from 'react';
import { func, number, string } from 'prop-types';
import { compose } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import AuthStore from 'stores/AuthStore';
import Analytics from 'instances/analytics';
import { getRemainingDays, isTrial } from 'selectors/subscriptions';
import { getItem, setItem } from 'helpers/localStorage';
import { PREMIUM_MONTHLY_PRODUCT, PREMIUM_PROVIDER_ID } from 'app-constants';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import moment from 'moment';
import PremiumAlmostExpired from '../components/PremiumAlmostExpired';

const STORAGE_KEY = 'PremiumExpiredDialogueTimestamp';

class PremiumAlmostExpiredContainer extends React.Component {
  static propTypes = {
    onClose: func,
    trialDaysLeft: number.isRequired,
    subscriptionUid: string.isRequired,
  };

  static defaultProps = {
    onClose: () => {},
  };

  state = {
    closed: false,
  };

  _onUpsell = () => {
    Analytics.track('Subscription Upsell Started', {
      subscription_product_uid: PREMIUM_MONTHLY_PRODUCT,
      provider_id: PREMIUM_PROVIDER_ID,
      internal_location: 'upsell_dialog',
    });

    setItem(STORAGE_KEY, moment().unix());
  };

  _onClose = (analyticsProps) => {
    Analytics.track('Upsell Dialog Dismissed', {
      ...analyticsProps,
    });

    setItem(STORAGE_KEY, moment().unix());

    this.setState({
      closed: true,
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { trialDaysLeft, subscriptionUid } = this.props;

    if (this.state.closed) {
      return null;
    }

    return (
      <PremiumAlmostExpired
        daysLeft={trialDaysLeft}
        onClose={this._onClose}
        onUpsell={this._onUpsell}
        subscriptionUid={subscriptionUid}
      />
    );
  }
}

function mapStateToProps({ authState, premiumSubscriptionState }, { onClose }) {
  const { user } = authState;
  const { subscription: premiumSubscription } = premiumSubscriptionState;

  const lastShownUnix = parseInt(getItem(STORAGE_KEY), 10);

  const isLastShownTooSoon =
    !isNaN(lastShownUnix) && moment().diff(moment.unix(lastShownUnix), 'hours') <= 23;
  const isUserNotInTrial = !user || !premiumSubscription || !isTrial(premiumSubscription);

  const trialDaysLeft = premiumSubscription ? getRemainingDays(premiumSubscription) : 0;
  const isIncorrectDaysLeft = trialDaysLeft > 4 || trialDaysLeft < 0;

  const isHidden = isLastShownTooSoon || isUserNotInTrial || isIncorrectDaysLeft;

  return {
    trialDaysLeft,
    isHidden,
    subscriptionUid: premiumSubscription && premiumSubscription.uid,
    onClose,
  };
}

mapStateToProps.stores = { AuthStore, PremiumSubscriptionStore };

const enhance = compose(altConnect(mapStateToProps), renderNothingIfIsHidden);

export default enhance(PremiumAlmostExpiredContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/PremiumAlmostExpiredContainer.js