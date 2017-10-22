import formatCurrency from 'helpers/formatcurrency';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import classNames from 'classnames';
import { translate } from 'instances/i18n';
import { getException } from 'helpers/countryExceptions';

function renderLab(labEnabled) {
  if (!labEnabled) {
    return null;
  }

  return (
    <Link className="lnk lab" href="/settings/lab">
      Lab
    </Link>
  );
}

export default class Sidebar extends React.Component {
  static propTypes = {
    balance: PropTypes.string.isRequired,
    labEnabled: PropTypes.bool,
    isCollapsed: PropTypes.bool,
  };

  render() {
    const balance = this.props.balance;
    const balanceText = formatCurrency(balance);

    const walletClassList = classNames([
      'lnk',
      'wallet',
      { 's-high': balance < 0 || balance >= 100 },
    ]);

    const balanceClassList = classNames([
      'balance',
      { 's-high': balance < 0 || balance >= 100 },
      { 's-low': balance < 1 },
    ]);

    let subscriptionsLink;
    if (!getException('hideSubscriptionsSetting', false)) {
      subscriptionsLink = (
        <Link className="lnk subscriptions" href="/settings/subscriptions">
          {translate('settings.subscriptions.title_short')}
        </Link>
      );
    }

    const className = classNames('sidebar left', this.props.isCollapsed && 'isCollapsed');

    return (
      <div className={className} onClick={this.props.onClickSidebar}>
        <Link className="lnk profile" aliases={['/settings']} href="/settings/profile">
          {translate('settings.profile.title')}
        </Link>
        <Link className="lnk emails" href="/settings/emails">
          {translate('settings.emails.title')}
        </Link>
        <Link className="lnk social" href="/settings/social">
          {translate('settings.social.title')}
        </Link>
        <Link className={walletClassList} href="/settings/wallet">
          {translate('settings.wallet.title')}
          <span className={balanceClassList}>{balanceText}</span>
        </Link>
        <Link className="lnk coupons" href="/settings/coupons">
          {translate('settings.coupons.title')}
        </Link>
        {subscriptionsLink}
        <Link className="lnk termsandconditions" href="/settings/termsandconditions">
          {translate('about.terms_and_conditions.navigation')}
        </Link>
        <Link className="lnk privacy" href="/settings/privacy">
          {translate('about.privacy_statement.navigation')}
        </Link>
        {renderLab(this.props.labEnabled)}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/Sidebar.js