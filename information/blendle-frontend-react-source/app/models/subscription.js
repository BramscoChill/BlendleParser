import { Model } from 'byebye';

const Subscription = Model.extend({
  required: {
    provider: true,
    username: true,
    password: true,
  },

  expressions: {
    provider: /^.+$/,
    password: /^.+$/,
    username: /^.+$/,
  },

  toJSON() {
    // Add data applicable for all payment methods.
    const response = {
      provider: this.get('provider'),
      username: this.get('username'),
      password: this.get('password'),
    };

    return response;
  },

  parse(resp) {
    const subscription = resp._embedded.provider;
    subscription.valid = resp.valid;
    return subscription;
  },
});

export default Subscription;



// WEBPACK FOOTER //
// ./src/js/app/models/subscription.js