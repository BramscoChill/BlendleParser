import React from 'react';
import PropTypes from 'prop-types';
import formatCurrency from 'helpers/formatcurrency';
import moment from 'moment';
import { translate } from 'instances/i18n';
import { getCurrency } from 'instances/i18n';
import TransactionRow from './TransactionRow';

function localizedInterval(intervalString) {
  const number = parseInt(intervalString.replace(/[^0-9]/g, ''), 10);
  const str = intervalString.replace(/[0-9 ]/g, '');

  return moment.duration(number, str).humanize();
}

function getTierPrice(product) {
  return product._embedded['b:tier']._embedded['b:tier-prices'].find(
    tier => tier.currency === getCurrency(),
  ).amount;
}

function getOrderText(order) {
  if (!order.getEmbedded('product')) {
    return '';
  }

  const product = order.getEmbedded('product').get('_embedded')['b:subscription-product'];
  const key = product.trial
    ? 'transactions.order.subscription_trial'
    : 'transactions.order.subscription';

  return translate(key, {
    interval: localizedInterval(product.interval),
    name: product.name,
    price: formatCurrency(getTierPrice(product), { includeSymbol: true }),
  });
}

function getDepositText(deposit) {
  const balance = formatCurrency(deposit.get('amount'));
  return translate(`settings.wallet.deposits.${deposit.get('type')}`, [balance]);
}

class TransactionsList extends React.Component {
  static propTypes = {
    deposits: PropTypes.object.isRequired, // byebye collections
    orders: PropTypes.object.isRequired, // byebye collections
    onLoadMore: PropTypes.func.isRequired,
    hasMore: PropTypes.bool.isRequired,
  };

  _getTransitions = () => {
    const deposits = this.props.deposits.map(deposit => ({
      type: 'deposit',
      data: deposit,
    }));

    const orders = this.props.orders.map(order => ({
      type: 'order',
      data: order,
    }));

    return [...deposits, ...orders].sort(
      (a, b) => new Date(b.data.get('created_at')) - new Date(a.data.get('created_at')),
    );
  };

  _renderItems = () =>
    this._getTransitions().map((item) => {
      const date = item.data.get('created_at') && moment(item.data.get('created_at')).calendar();
      const text = item.type === 'order' ? getOrderText(item.data) : getDepositText(item.data);
      return <TransactionRow key={item.type + item.data.id} text={text} date={date} />;
    });

  _renderLoadMore = () => {
    if (this.props.hasMore) {
      return (
        <a className="lnk-loadmore" onClick={this.props.onLoadMore}>
          {translate('settings.wallet.load_more_user_deposits')}
        </a>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="v-transactions overview">
        <h2 className="title">{translate('settings.wallet.list_user_deposits')}</h2>
        <ul className="transactions-list list">{this._renderItems()}</ul>
        {this._renderLoadMore()}
      </div>
    );
  }
}

export default TransactionsList;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/TransactionsList.js