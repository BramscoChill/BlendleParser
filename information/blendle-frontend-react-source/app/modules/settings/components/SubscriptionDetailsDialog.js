import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dialog from 'components/dialogues/Dialogue';
import Button from 'components/Button';
import PremiumSubscriptionCancelContainer from '../containers/PremiumSubscriptionCancelContainer';
import { translate, translateElement, formatCurrency } from 'instances/i18n';
import { providerById, prefillSelector } from 'selectors/providers';
import moment from 'moment';
import { getCurrency } from 'instances/i18n';
import { isPromo, isPremiumSubscription } from 'selectors/subscriptions';

function getProviderName(providerUid) {
  return prefillSelector(providerById)(providerUid).name;
}

function getTierPrice(product) {
  return product._embedded['b:tier']._embedded['b:tier-prices'].find(
    tier => tier.currency === getCurrency(),
  );
}

function getInterval(product) {
  const months = Math.round(moment.duration(product.interval_seconds, 'seconds').asMonths());
  const days = Math.round(moment.duration(product.interval_seconds, 'seconds').asDays());

  if (months === 1) {
    return translate('app.time_units.month');
  }

  if (months === 0 && days === 7) {
    return `${days} ${translate('app.time_units.days')}`;
  }

  return `${months} ${translate('app.time_units.months')}`;
}

export default class extends React.Component {
  static propTypes = {
    subscription: PropTypes.object.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onCancelSubscription: PropTypes.func.isRequired,
    onUpdateReason: PropTypes.func.isRequired,
  };

  state = {
    showCancel: false,
  };

  _onClickShowCancel = (e) => {
    e.preventDefault();

    this.setState({
      showCancel: true,
    });
  };

  _renderDetails = subscription => (
    <span>
      {translateElement(<h2 />, 'settings.subscriptions.info.title', [
        getProviderName(subscription.provider.uid),
      ])}
      {this._renderDetailsBody()}
      <Button className="btn-fullwidth" onClick={this.props.onDismiss}>
        {translate('app.buttons.ok_i_get_it')}
      </Button>
      <Button className="btn-fullwidth btn-secondary" onClick={this._onClickShowCancel}>
        {translate('settings.subscriptions.card.button_quit')}
      </Button>
    </span>
  );

  _renderDetailsBody = () => {
    const { subscription } = this.props;

    const provider = getProviderName(subscription.provider.uid);
    const price = formatCurrency(getTierPrice(subscription.product).amount);
    const interval = getInterval(subscription.product);
    const date = subscription.endDate.format('Do');

    if (isPromo(subscription.product)) {
      const successor = subscription.product._embedded.successor;
      return translateElement(<p />, 'settings.subscriptions.info.body_promo', {
        provider,
        price,
        interval,
        successorPrice: formatCurrency(getTierPrice(successor).amount),
        successorInterval: getInterval(successor),
      });
    }

    return [
      translateElement(<p />, 'settings.subscriptions.info.body_1', {
        provider,
        price,
        period: interval,
      }),
      translateElement(<p />, 'settings.subscriptions.info.body_2', {
        interval,
        date,
      }),
    ];
  };

  _renderCancel = subscription => (
    <span>
      {translateElement(<h2 />, 'settings.subscriptions.cancel.title')}
      {translateElement(<p />, 'settings.subscriptions.cancel.body', {
        provider: getProviderName(subscription.provider.uid),
        date: subscription.endDate.calendar(),
      })}
      <textarea
        onChange={e => this.props.onUpdateReason(e.target.value)}
        className="inp inp-textarea"
        placeholder={translate('settings.subscriptions.cancel.reason_placeholder')}
      />
      <Button className="btn-fullwidth" onClick={this.props.onDismiss}>
        {translate('settings.subscriptions.cancel.button_keep')}
      </Button>
      <Button
        className="btn-fullwidth btn-secondary"
        onClick={() => this.props.onCancelSubscription(subscription)}
      >
        {translate('settings.subscriptions.cancel.button_cancel')}
      </Button>
    </span>
  );

  render() {
    const { subscription } = this.props;
    const isPremiumProduct = isPremiumSubscription(subscription);
    let content = this._renderDetails(subscription);
    if (this.state.showCancel) {
      content = this._renderCancel(subscription);

      if (isPremiumProduct) {
        content = (
          <PremiumSubscriptionCancelContainer
            subscription={this.props.subscription}
            onCancelSubscription={() => this.props.onCancelSubscription(subscription)}
            onDismiss={this.props.onDismiss}
            onUpdateReason={this.props.onUpdateReason}
          />
        );
      }
    }

    const dialogClassNames = classNames('subscription-details', {
      'is-premium-product': isPremiumProduct,
    });

    return (
      <Dialog className={dialogClassNames} onClose={this.props.onDismiss}>
        {content}
      </Dialog>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/SubscriptionDetailsDialog.js