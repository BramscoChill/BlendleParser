import { Model } from 'byebye';
import Item from 'models/item';
import Issue from 'models/issue';
import Manifest from 'models/manifest';
import PayItem from 'models/PayItem';

const Transaction = Model.extend({
  name: 'transaction',
  mappings: {
    item: { resource: Item },
    issue: { resource: Issue },
    manifest: { resource: Manifest },
    pay_item: { resource: PayItem },
  },
  parse(resp) {
    // Get the correct manifest out of the response
    if (resp._embedded) {
      if (
        resp._embedded.refunded_transaction &&
        resp._embedded.refunded_transaction._embedded.item
      ) {
        resp._embedded.manifest =
          resp._embedded.refunded_transaction._embedded.item._embedded.manifest;
      }

      if (
        resp._embedded.refunded_transaction &&
        resp._embedded.refunded_transaction._embedded.pay_item
      ) {
        resp._embedded.pay_item = resp._embedded.refunded_transaction._embedded.pay_item;
      }

      if (resp._embedded.item && resp._embedded.item._embedded.manifest) {
        resp._embedded.manifest = resp._embedded.item._embedded.manifest;
      }

      /**
       * @todo rewrite as soon as backend has rewrote this
       *
       * Ugly hack to work around weird backend api choice
       */
      if (resp._embedded.issue) {
        resp._embedded.issue = resp._embedded.issue._embedded.issue;
      }
    }

    return this.parseHal(resp);
  },
});

export default Transaction;



// WEBPACK FOOTER //
// ./src/js/app/models/transaction.js