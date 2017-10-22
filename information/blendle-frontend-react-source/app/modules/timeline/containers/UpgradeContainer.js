import React, { PureComponent } from 'react';
import { func } from 'prop-types';
import { compose } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import {
  PREMIUM_MONTHLY_PRODUCT,
  PREMIUM_PROVIDER_ID,
  HIDE_PREMIUM_BULLETIN_KEY,
} from 'app-constants';
import SessionActions from 'actions/SessionActions';
import { getUpsellAnalyticsTags } from 'helpers/upsell';
import Analytics from 'instances/analytics';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import AuthStore from 'stores/AuthStore';
import SessionStore from 'stores/SessionStore';
import { getRemainingDays, isTrial } from 'selectors/subscriptions';
import UpgradeBulletin from '../components/UpgradeBulletin';

function getViewportAnalyticsPayload() {
  const { subscription } = PremiumSubscriptionStore.getState();
  return {
    subscription_product_uid: subscription.uid,
    provider_id: subscription.provider.uid,
    tags: getUpsellAnalyticsTags(subscription, PREMIUM_MONTHLY_PRODUCT),
  };
}

function handleBulletinHidden() {
  SessionActions.setItem(HIDE_PREMIUM_BULLETIN_KEY, true);
  Analytics.track('Upsell Bulletin Out Of Viewport', getViewportAnalyticsPayload());
}

function handleBulletinVisible() {
  Analytics.track('Upsell Bulletin In Viewport', getViewportAnalyticsPayload());
}

function handleUpsellClicked() {
  SessionActions.setItem(HIDE_PREMIUM_BULLETIN_KEY, true);

  const { subscription } = PremiumSubscriptionStore.getState();

  Analytics.track('Subscription Upsell Started', {
    subscription_product_uid: subscription.uid,
    provider_id: PREMIUM_PROVIDER_ID,
    internal_location: 'upsell_bulletin',
  });
}

const actions = {
  onBulletinHidden: handleBulletinHidden,
  onBulletinVisible: handleBulletinVisible,
  onUpsellClicked: handleUpsellClicked,
};

function mapStatesToProps({ premiumSubscriptionState, authState, sessionState }) {
  const premiumSubscription = premiumSubscriptionState.subscription;

  const showUpgradeBulletin =
    premiumSubscription && isTrial(premiumSubscription) && !premiumSubscription.renew;

  const isHiddenBySessionStore = sessionState.data[HIDE_PREMIUM_BULLETIN_KEY];

  if (!showUpgradeBulletin || isHiddenBySessionStore) {
    return { isHidden: true };
  }

  return {
    daysLeft: getRemainingDays(premiumSubscription),
    name: authState.user.attributes.first_name,
    hadPremiumSubscription: !!premiumSubscription,
    followupSubscription: PREMIUM_MONTHLY_PRODUCT,
  };
}

mapStatesToProps.stores = { PremiumSubscriptionStore, AuthStore, SessionStore };

// this is defined in the css, well this could also be done with CSS Transition group, but keep the
// things simple here
const ANIMATION_DELAY_MS = 500;

const DELAY_BEFORE_VISIBLE_MS = 3000; // Bulletin has a delay of 3 seconds
const HIDDEN_AFTER_MS = 10000 + DELAY_BEFORE_VISIBLE_MS; // Bulletin is visible for 10s

class UpgradeBulletinContainer extends PureComponent {
  static propTypes = {
    onBulletinVisible: func.isRequired,
    onBulletinHidden: func.isRequired,
  };

  state = { isVisible: false };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.bulletinVisibleTimeout);
    clearTimeout(this.bulletinHiddenTimeout);
  }

  startTimer() {
    this.timer = {
      start: Date.now(),
      stop: Date.now() + HIDDEN_AFTER_MS,
    };

    this.bulletinVisibleTimeout = setTimeout(() => {
      this.setState({ isVisible: true }, this.props.onBulletinVisible);
    }, DELAY_BEFORE_VISIBLE_MS);

    this.bulletinHiddenTimeout = setTimeout(() => {
      this.hideBulletin();
    }, HIDDEN_AFTER_MS);
  }

  pauseTimer = () => {
    this.timer.remaining = this.timer.stop - Date.now();
    clearTimeout(this.bulletinVisibleTimeout);
    clearTimeout(this.bulletinHiddenTimeout);
  };

  resumeTimer = () => {
    this.timer.stop = Date.now() + this.timer.remaining;
    this.bulletinHiddenTimeout = setTimeout(() => {
      this.hideBulletin();
    }, this.timer.remaining);
  };

  hideBulletin = () => {
    this.setState({ isVisible: false }, () =>
      setTimeout(this.props.onBulletinHidden, ANIMATION_DELAY_MS),
    );
  };

  render() {
    const { onBulletinHidden, onBulletinVisible, ...props } = this.props;

    return (
      <UpgradeBulletin
        onCloseClick={this.hideBulletin}
        isVisible={this.state.isVisible}
        onMouseEnter={this.pauseTimer}
        onMouseLeave={this.resumeTimer}
        {...props}
      />
    );
  }
}

export default compose(altConnect(mapStatesToProps, actions), renderNothingIfIsHidden)(
  UpgradeBulletinContainer,
);



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/containers/UpgradeContainer.js