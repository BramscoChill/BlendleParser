import moment from 'moment';
import { translate } from 'instances/i18n';
import React from 'react';
import PropTypes from 'prop-types';
import { removeTrailingSlash, removeProtocol } from 'helpers/url';
import { providerById, prefillSelector } from 'selectors/providers';
import { getManifestBody, getTitle, getContentAsText } from 'helpers/manifest';
import PurchaseRow from './PurchaseRow';

class PurchasesOverview extends React.Component {
  static propTypes = {
    purchases: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
  };

  _getPayPurchaseText = (payItem) => {
    const provider = payItem.getProvider();
    const title = this._getPayPurchaseTitle(payItem);

    if (provider) {
      return `${provider.name} - ${title}`;
    }

    return title;
  };

  _getPayPurchaseTitle = (payItem) => {
    const url = removeTrailingSlash(removeProtocol(payItem.getUrl()));
    const title = payItem.get('b:metadata').get('title');

    if (title && title !== '') {
      return `${title} (${url})`;
    }

    return url;
  };

  _renderPayPurchase = (transaction, payItem) => (
    <PurchaseRow
      key={transaction.id}
      href={payItem.getUrl()}
      refund={transaction.get('type') === 'refund' || transaction.get('type') === 'auto-refund'}
      date={transaction.get('created_at')}
      text={this._getPayPurchaseText(payItem)}
      amount={transaction.get('amount')}
      target="_blank"
    />
  );

  _renderItemPurchase = (transaction, manifest) => {
    const providerName = prefillSelector(providerById)(manifest.get('provider').id).name;
    const manifestBody = getManifestBody(manifest);
    const title = getContentAsText(getTitle(manifestBody));

    return (
      <PurchaseRow
        key={transaction.id}
        href={`/item/${manifest.id}`}
        refund={transaction.get('type') === 'refund' || transaction.get('type') === 'auto-refund'}
        date={transaction.get('created_at')}
        text={`${providerName} - ${title}`}
        amount={transaction.get('amount')}
      />
    );
  };

  _renderIssuePurchase = (transaction, issue) => {
    const provider = prefillSelector(providerById)(issue.get('provider').id);
    const issueDateString = moment(issue.get('date'))
      .calendar()
      .toLowerCase();

    return (
      <PurchaseRow
        key={transaction.id}
        href={`/issue/${provider.id}/${issue.id}`}
        refund={transaction.get('type') === 'refund' || transaction.get('type') === 'auto-refund'}
        date={transaction.get('created_at')}
        text={`
          ${provider.name} - ' +
          ${translate('settings.wallet.transactions.issue', [issueDateString])}
        `}
        amount={transaction.get('amount')}
      />
    );
  };

  _renderPurchases = () =>
    this.props.purchases.map((transaction) => {
      if (transaction.getEmbedded('manifest')) {
        return this._renderItemPurchase(transaction, transaction.getEmbedded('manifest'));
      }
      if (transaction.getEmbedded('issue')) {
        return this._renderIssuePurchase(transaction, transaction.getEmbedded('issue'));
      }
      if (transaction.getEmbedded('pay_item')) {
        return this._renderPayPurchase(transaction, transaction.getEmbedded('pay_item'));
      }
      return null;
    });

  _renderLoadMore = () => {
    if (this.props.hasMore) {
      return (
        <a className="lnk-loadmore" onClick={this.props.onLoadMore}>
          {translate('settings.wallet.load_more_user_items')}
        </a>
      );
    }

    return null;
  };

  render() {
    return (
      <div className="v-purchases overview">
        <h2 className="title">{translate('settings.wallet.list_user_items')}</h2>
        <ul className="purchases-list list">{this._renderPurchases()}</ul>
        {this._renderLoadMore()}
      </div>
    );
  }
}

export default PurchasesOverview;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/PurchasesList.js