import { Collection, Model } from 'byebye';

export default Collection.extend({
  product: null, // should be provided when creating an instance
  key: '_embedded.b:orders',
  model: Model,

  parse(resp) {
    if (resp._embedded) {
      resp._embedded['b:orders'] = resp._embedded['b:orders'].map(order => ({
        ...order,
        product: this.product,
      }));
    }
    return this.parseHal(resp);
  },

  comparator(order) {
    return -order.get('created_at');
  },
});



// WEBPACK FOOTER //
// ./src/js/app/collections/userOrders.js