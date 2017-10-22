import { Collection } from 'byebye';
import User from 'models/user';

export default Collection.extend({
  key: '_embedded.users',
  model(attributes, options) {
    return new User(attributes, options);
  },
  parse(resp) {
    return this.parseHal(resp);
  },
});



// WEBPACK FOOTER //
// ./src/js/app/collections/users.js