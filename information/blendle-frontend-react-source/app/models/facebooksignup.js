import { Model } from 'byebye';

const FacebookSignUp = Model.extend({
  required: {
    facebook_id: true,
    facebook_access_token: true,
  },
});

export default FacebookSignUp;



// WEBPACK FOOTER //
// ./src/js/app/models/facebooksignup.js