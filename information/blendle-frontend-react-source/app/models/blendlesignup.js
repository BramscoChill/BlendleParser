import { Model } from 'byebye';
import { emailRegex } from 'helpers/validate';

export default Model.extend({
  required: {
    email: true,
    password: false,
  },
  expressions: {
    email: emailRegex,
    password: /^.+$/,
  },
});



// WEBPACK FOOTER //
// ./src/js/app/models/blendlesignup.js