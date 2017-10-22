import { Collection } from 'byebye';
import Transaction from 'models/transaction';

const Transactions = Collection.extend({
  model: Transaction,
  key: '_embedded.transactions',
  allowed_transactions: ['purchase', 'refund', 'auto-refund'],
  parse(resp) {
    const transactions = [];

    for (let i = 0; i < resp._embedded.transactions.length; i++) {
      if (this.allowed_transactions.indexOf(resp._embedded.transactions[i].type) > -1) {
        transactions.push(resp._embedded.transactions[i]);
      }
    }

    resp._embedded.transactions = transactions;

    return this.parseHal(resp);
  },
  comparator(transaction) {
    return -transaction.get('created_at');
  },
});

export default Transactions;



// WEBPACK FOOTER //
// ./src/js/app/collections/transactions.js