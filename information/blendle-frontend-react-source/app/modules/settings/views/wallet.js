import formatCurrency from 'helpers/formatcurrency';
import Settings from 'controllers/settings';
import Auth from 'controllers/auth';
import { translate, translateElement, getCurrencyWord } from 'instances/i18n';
import FormView from 'views/helpers/form';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import TransactionsCollection from 'collections/transactions';
import UserOrdersCollection from 'collections/userOrders';
import DepositsCollection from 'collections/deposits';
import PaymentStore from 'stores/PaymentStore';
import { Checkbox } from '@blendle/lego';
import Link from 'components/Link';
import PurchasesList from '../components/PurchasesList';
import TransactionsList from '../components/TransactionsList';

const WalletView = FormView.extend({
  initialize() {
    this._paymentStoreChanged = this._paymentStoreChanged.bind(this);
    PaymentStore.listen(this._paymentStoreChanged);

    this._recurring = PaymentStore.getState().recurring || this.options.recurring;

    this._purchases = new TransactionsCollection(null, {
      url: Settings.getLink('transactions', { user_id: Auth.getId() }),
    });

    this._deposits = new DepositsCollection(null, {
      url: Settings.getLink('deposits', { user_id: Auth.getId() }),
    });

    this._orders = new UserOrdersCollection(null, {
      product: 'subscription',
      url: Settings.getLink('user_orders', { user_id: Auth.getId(), product: 'subscription' }),
    });

    this._render = this.render.bind(this);

    this._purchases.on('sync', this._render);
    this._purchases.fetch();

    this._deposits.on('sync', this._render);
    this._deposits.fetch();

    this._bindedOnOrdersSynced = this._onOrdersSynced.bind(this);
    this._orders.on('sync', this._bindedOnOrdersSynced);
    this._orders.fetch({ accept: 'application/hal+json' });
  },

  beforeUnload() {
    this._deposits.off('sync', this._render);
    this._purchases.off('sync', this._render);
    this._orders.off('sync', this._bindedOnOrdersSynced);

    PaymentStore.unlisten(this._paymentStoreChanged);

    ReactDOM.unmountComponentAtNode(this.el);

    FormView.prototype.beforeUnload.apply(this, arguments);
  },

  _paymentStoreChanged(state) {
    if (state.recurring) {
      this._recurring = state.recurring;
      this.render();
    }
  },

  _fetchOrderProduct(order) {
    return order.getRelation('product', { accept: 'application/hal+json' }).catch((error) => {
      // expired products (like subscriptions) return a 402
      if (error.status === 402) {
        return Promise.resolve(order.setEmbedded('product', error.data));
      }
      throw error;
    });
  },

  _onOrdersSynced() {
    // manually zoom all products, since the zooming proxy can't do this for us
    const products = this._orders.map(this._fetchOrderProduct);
    Promise.all(products).then(this._render.bind(this));
  },

  _onLoadMoreTransactions(e) {
    e.preventDefault();

    if (this._deposits.hasNext()) {
      this._deposits.fetchNext();
    }
    if (this._orders.hasNext()) {
      this._orders.fetchNext();
    }
  },

  _onLoadMorePurchases(e) {
    e.preventDefault();

    this._purchases.fetchNext();
  },

  _toggleRecurring() {
    this.options.setRecurringState(!this._recurring.enabled).then((recurring) => {
      this._recurring = recurring;
      this.getController().onRecurringChanged(recurring);
      this.render();
    });
  },

  _renderRecurring() {
    if (
      this._recurring.state === 'norecurring_hascontracts' ||
      this._recurring.state === 'recurring'
    ) {
      const recurringClass = classNames('block recurring-block', this._recurring.state);
      const recurringText = translate('payment.recurring.label', {
        currency: getCurrencyWord(),
        currency_plural: getCurrencyWord({ plural: true }),
      });

      return (
        <div className={recurringClass} data-test-identifier="recurring-toggle-elements">
          <h2 className="title">{translateElement('payment.recurring.title')}</h2>
          <Checkbox
            id="recurring-toggle"
            name="recurring"
            checked={this._recurring.state === 'recurring'}
            onChange={this._toggleRecurring.bind(this)}
          >
            {recurringText}
            <br />
            <span className="note">{translate('payment.recurring.label_note')}</span>
          </Checkbox>
        </div>
      );
    }
  },

  _renderUnconfirmedEmail() {
    return (
      <div className="block unconfirmed">
        <p className="warn">{translate('settings.wallet.unconfirmed_warning')}</p>
        <p dangerouslySetInnerHTML={{ __html: translate('settings.wallet.unconfirmed') }} />
      </div>
    );
  },

  _renderBalance() {
    if (!Auth.getUser().get('email_confirmed')) {
      return this._renderUnconfirmedEmail();
    }

    const balance = formatCurrency(this.model.get('balance'));
    const titleClass = classNames('title', { 's-low': this.model.get('balance') < 1 });

    return (
      <div className="block">
        <h2 className={titleClass}>{translateElement('settings.wallet.balance', [balance])}</h2>
        <p>
          <Link
            href="/payment"
            state={{ returnUrl: '/settings/wallet' }}
            className="btn btn-text btn-blendle-icon-green btn-increase-balance lnk-payment"
          >
            {translate('settings.buttons.increase_balance')}
          </Link>
          <a href="/settings/coupons" className="lnk-redeem-coupon">
            {translate('settings.buttons.redeem_coupon')}
          </a>
        </p>
      </div>
    );
  },

  render() {
    ReactDOM.render(
      <div className="v-wallet pane">
        <div className="container">
          <h2 className="header">{translate('settings.wallet.title')}</h2>
          {this._renderBalance()}
          {this._renderRecurring()}

          <div className="overviews">
            <PurchasesList
              purchases={this._purchases}
              hasMore={this._purchases.hasNext()}
              onLoadMore={this._onLoadMorePurchases.bind(this)}
            />

            <TransactionsList
              deposits={this._deposits}
              orders={this._orders}
              hasMore={this._deposits.hasNext() || this._orders.hasNext()}
              onLoadMore={this._onLoadMoreTransactions.bind(this)}
            />
          </div>
        </div>
      </div>,
      this.el,
    );

    this.display();

    return this;
  },
});

export default WalletView;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/wallet.js