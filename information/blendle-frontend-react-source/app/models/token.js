import Model from 'libs/byebye/model';
import User from 'models/user';

export default Model.extend({
  mappings: {
    user: { resource: User },
    'b:user': { resource: User },
  },
});



// WEBPACK FOOTER //
// ./src/js/app/models/token.js