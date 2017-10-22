import UserModel from 'models/user';

export default UserModel.extend({
  name: 'channel',
  isChannel: true,
  mappings: {
    managers: {
      resource(resp) {
        const Users = require('collections/users');
        return new Users({ _embedded: { users: resp } }, { parse: true });
      },
    },
  },
});



// WEBPACK FOOTER //
// ./src/js/app/models/channel.js