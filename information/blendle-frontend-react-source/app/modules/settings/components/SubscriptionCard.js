import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'instances/i18n';
import Link from 'components/Link';
import { getProviderLogoUrl } from 'helpers/providerHelpers';
import { getRemainingDays, isActive, inFuture } from 'selectors/subscriptions';
import {
  PREMIUM_ALL_SUBSCRIPTION_PRODUCTS,
  PREMIUM_PRODUCTS_MANAGED_EXTERNALLY,
} from 'app-constants';
import { translateInterval } from 'helpers/translateInterval';

class SubscriptionCard extends PureComponent {
  static propTypes = {
    subscription: PropTypes.object.isRequired,
    onClickMoreInfo: PropTypes.func.isRequired,
    onClickUpsell: PropTypes.func.isRequired,
    onClickCancelButton: PropTypes.func.isRequired,
  };

  _onUpsellClicked = () => {
    this.props.onClickUpsell(this.props.subscription);
  };

  _getType = () => {
    if (PREMIUM_ALL_SUBSCRIPTION_PRODUCTS.includes(this.props.subscription.uid)) {
      return 'Blendle Premium';
    }

    if (this.props.subscription.trial && !this.props.subscription.renew) {
      return translate('settings.subscriptions.card.subscription_trial');
    }

    return translate('settings.subscriptions.card.subscription');
  };

  _getPartnerTitle() {
    // For now only externally managed subscriptions via Vodafone
    return 'Vodafone';
  }

  _isManagedExternally() {
    return PREMIUM_PRODUCTS_MANAGED_EXTERNALLY.includes(this.props.subscription.uid);
  }

  _getTimeInfo = () => {
    const { subscription } = this.props;

    if (this._isManagedExternally()) {
      return null; // do not show time info
    }

    if (inFuture(subscription)) {
      // return interval if subscription did not start yet
      return translateInterval(subscription.product.interval);
    }

    if (subscription.renew) {
      return translate('settings.subscriptions.card.auto_renewing');
    }

    const days = getRemainingDays(subscription);

    if (days <= 0) {
      return <span className="expired">{translate('settings.subscriptions.card.expired')}</span>;
    }

    if (days <= 1) {
      return translate('settings.subscriptions.card.remaining_single', [days]);
    }

    return translate('settings.subscriptions.card.remaining_multiple', [days]);
  };

  _renderAction() {
    const { subscription } = this.props;

    if (inFuture(subscription)) {
      return (
        <div className="btn-subscription disabled">
          {translate('settings.subscriptions.card.starts_at', [subscription.startDate.format('L')])}
        </div>
      );
    }

    if (!isActive(subscription) && !subscription.renew) {
      const providerId = subscription.product.provider_uid;
      return (
        <Link
          analytics={{ internal_location: 'expired-subscription-card' }}
          onClick={this._onUpsellClicked}
          className="btn-subscription"
          href={`/subscription/${providerId}`}
        >
          {translate('settings.subscriptions.card.reactivate')}
        </Link>
      );
    }

    if (this._isManagedExternally()) {
      return (
        <div className="btn-subscription disabled">
          {translate('settings.subscriptions.card.via_partner', [this._getPartnerTitle()])}
        </div>
      );
    }

    // We don't have a flow for converting trial subscriptions to actual subscriptions yet,
    // so there's no action (and therefor no button), only for non-renewable subs (like a trial)
    if (!subscription.renew) {
      return (
        <div className="btn-subscription disabled">
          {translate('settings.subscriptions.card.button_stops_automatically')}
        </div>
      );
    }

    if (!subscription.isLegacy) {
      return (
        <div className="btn-subscription" onClick={() => this.props.onClickMoreInfo(subscription)}>
          {translate('settings.subscriptions.card.button_more_info')}
        </div>
      );
    }

    return (
      <div
        className="btn-subscription"
        onClick={() => this.props.onClickCancelButton(subscription)}
      >
        {translate('settings.subscriptions.card.button_disconnect')}
      </div>
    );
  }

  render() {
    const providerId = this.props.subscription.provider.uid;
    const providerLogo = getProviderLogoUrl(providerId, 'logo.png');
    const subscriptionCardClassNames = classNames('subscription-card', providerId);
    const subscriptionInfoClassNames = classNames('subscription-info', {
      'will-expire': !this.props.subscription.renew,
    });

    return (
      <div className={subscriptionCardClassNames}>
        <img src="/img/illustrations/card-hole.png" alt="" className="card-hole" />

        <div className="section-provider-logo">
          <img src={providerLogo} className="subscription-provider-logo" />
        </div>

        <div className="section-info">
          <div className="subscription-type">{this._getType()}</div>
          <div className={subscriptionInfoClassNames}>{this._getTimeInfo()}</div>
        </div>

        {this._renderAction()}
      </div>
    );
  }
}

export default SubscriptionCard;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/SubscriptionCard.js