import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import SubscriptionsManager from 'managers/subscriptions';
import { translate, translateElement } from 'instances/i18n';
import { getException } from 'helpers/countryExceptions';
import Link from 'components/Link';
import { getIssueDateString } from 'helpers/dateString';
import PopularItem from 'modules/issue/components/PopularItem';
import { find } from 'lodash';

class PopularItemsInIssue extends PureComponent {
  static propTypes = {
    provider: PropTypes.object.isRequired,
    issue: PropTypes.object,
    disabled: PopularItem.propTypes.disabled,
    popularItems: PropTypes.array.isRequired,
  };

  _renderSubscription() {
    const canSubscribe = find(SubscriptionsManager.getProviders(), { id: this.props.provider.id });
    const acquisition = this.props.issue.getEmbedded('b:issue-acquisition');

    if (
      getException('hideSubscriptionsSetting', false) ||
      !canSubscribe ||
      (acquisition && !acquisition.get('subscription'))
    ) {
      return null;
    }

    if (this.props.popularItems.length === 0) {
      return null;
    }

    const url = `/settings/subscriptions/${this.props.provider.id}`;
    const providerName = this.props.provider.name;

    if (acquisition && acquisition.get('subscription')) {
      return (
        <div className="bottom-content">
          <div className="is-subscribed">
            <h3>{translate('issue.popular.is_subscribed_header')}</h3>
            <p className="subscribed">
              <span className="subscriber">{translate('issue.popular.subscriber')}</span>
              {translate('issue.popular.is_subscribed_content', [providerName])}
              <span className="edit-subscription">
                <Link href="/settings/subscriptions">({translate('issue.popular.edit')})</Link>
              </span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bottom-content">
        <div className="can-subscribe">
          <h3>{translate('issue.popular.subscribed')}</h3>
          <p>
            <Link href={url}>{translate('issue.popular.subscription')}</Link>
          </p>
        </div>
      </div>
    );
  }

  _renderPopularItems() {
    return this.props.popularItems
      .slice(0, 3)
      .map(item => <PopularItem key={item.id} item={item} disabled={this.props.disabled} />);
  }

  render() {
    const issueAcquisition = this.props.issue.getEmbedded('b:issue-acquisition');
    const providerName = this.props.provider.name;
    const className = classNames([
      'v-popular-in-issue',
      'tile-explain',
      { 'l-acquire-issue': issueAcquisition && issueAcquisition.isEligibleForAcquisition() },
    ]);

    return (
      <div className={className}>
        <div className="explanation">
          <h2>
            {translateElement('issue.popular.title')}
            {getIssueDateString(moment(this.props.issue.get('date')), providerName)}
          </h2>
        </div>
        <ul className="popular-list">{this._renderPopularItems()}</ul>
        {this._renderSubscription()}
      </div>
    );
  }
}

export default PopularItemsInIssue;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/PopularItemsInIssue.js