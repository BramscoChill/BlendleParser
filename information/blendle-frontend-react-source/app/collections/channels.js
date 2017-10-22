import UsersCollection from 'collections/users';
import Channel from 'models/channel';

export default UsersCollection.extend({
  model(attributes, options) {
    return new Channel(attributes, options);
  },
});



// WEBPACK FOOTER //
// ./src/js/app/collections/channels.js