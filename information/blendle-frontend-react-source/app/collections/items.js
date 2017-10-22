import { filter } from 'lodash';
import { Collection } from 'byebye';
import Item from 'models/item';

const Items = Collection.extend({
  model: Item,
  type: 'items',
  key: '_embedded.items',
  parse(resp) {
    if (resp.total) {
      this.total = resp.total;
    }

    if (this.options.exclude) {
      resp._embedded.items = filter(
        resp._embedded.items,
        item => item.id !== this.options.exclude,
        this,
      );
    }
    return this.parseHal(resp);
  },
  comparator(item) {
    return -item.get('date');
  },
});

export default Items;



// WEBPACK FOOTER //
// ./src/js/app/collections/items.js