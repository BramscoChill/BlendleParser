import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import formatCurrency from 'helpers/formatcurrency';
import { translate, translateElement } from 'instances/i18n';
import Link from 'components/Link';
import Analytics from 'instances/analytics';
import IssueStackContainer from 'containers/IssueStackContainer';
import classNames from 'classnames';
import ModuleNavigationPortal from 'components/moduleNavigation/ModuleNavigationPortal';
import moment from 'moment';
import { getProviderLogoUrl } from 'helpers/providerHelpers';
import CSS from './styles.scss';

class SubscriptionPage extends PureComponent {
  static propTypes = {
    providerId: PropTypes.string.isRequired,
    toSubscription: PropTypes.object.isRequired,
    userCurrency: PropTypes.string.isRequired,
    providerName: PropTypes.string.isRequired,
    latestIssue: PropTypes.object,
    daysRemaining: PropTypes.number,
  };

  componentDidMount() {
    const price = this.props.toSubscription._embedded['b:tier']._embedded['b:tier-prices'].find(
      tier => tier.currency === this.props.userCurrency,
    ).amount;

    Analytics.track('Provider Subscription/Subscription Upgrade Landing Shown', {
      provider_uid: this.props.providerId,
      subscription_product_uid: this.props.toSubscription.uid,
      offer: price,
    });
  }

  _renderLatestIssue() {
    return <IssueStackContainer providerId={this.props.providerId} />;
  }

  _renderDetails() {
    const numberOfMonths = Math.round(
      this.props.toSubscription.interval_seconds / (60 * 60 * 24 * 30),
    );
    const duration = moment.duration(numberOfMonths, 'month').humanize();
    const price = this.props.toSubscription._embedded['b:tier']._embedded['b:tier-prices'].find(
      tier => tier.currency === this.props.userCurrency,
    ).amount;

    if (this.props.daysRemaining >= 1) {
      if (numberOfMonths > 1) {
        return translateElement(<p />, 'subscription.body_flexible_period_trial', {
          provider: this.props.providerName,
          days: this.props.daysRemaining,
          price: formatCurrency(price),
          period: duration,
        });
      }

      return translateElement(<p />, 'subscription.body_month_trial', {
        provider: this.props.providerName,
        days: this.props.daysRemaining,
        price: formatCurrency(price),
      });
    }

    if (numberOfMonths > 1) {
      return translateElement(<p />, 'subscription.body_flexible_period', {
        provider: this.props.providerName,
        price: formatCurrency(price),
        period: duration,
      });
    }

    return translateElement(<p />, 'subscription.body_month', {
      provider: this.props.providerName,
      price: formatCurrency(price),
    });
  }

  render() {
    const providerLogo = getProviderLogoUrl(this.props.providerId, 'logo.png');
    const paymentUrl = `/payment/subscription/${this.props.toSubscription.uid}`;

    const pageClassNames = classNames([
      'subscription-page',
      'item',
      `provider-${this.props.providerId}`,
    ]);

    return (
      <div className={pageClassNames}>
        <ModuleNavigationPortal items={null} />
        <div className="subscription-page-container">
          <div className="subscription-page-coverholder">{this._renderLatestIssue()}</div>
          <img className="subscription-provider-logo" src={providerLogo} />
          <div className="subscription-page-content">
            <h1 className="subscription-page-title item-title">
              {translate('subscription.header', [this.props.providerName])}
            </h1>
            <div className="subscription-page-details">{this._renderDetails()}</div>
            <Link href={paymentUrl} className="btn subscription-page-btn">
              {translate('subscription.accept')}
            </Link>
            <p className={CSS.privacyNote}>
              {translate('subscription.privacy_note', { provider: this.props.providerName })}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SubscriptionPage;



// WEBPACK FOOTER //
// ./src/js/app/modules/subscription/components/SubscriptionPage.js