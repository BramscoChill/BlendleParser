import ByeBye from 'byebye';
import Country from 'instances/country';
import Settings from 'controllers/settings';
import { merge } from 'lodash';

const CodeModel = ByeBye.Model.extend({
  defaults: {
    code: null,
    used: true,
  },

  required: {
    code: true,
  },

  idAttribute: 'code',

  initialize() {
    this.urlTemplate = Settings.get('links').signup_code.href;
  },

  sync(method, model) {
    model.url = this.urlTemplate.replace('{code}', model.id);

    return ByeBye.Model.prototype.sync.apply(this, arguments);
  },

  exportForSignUp(userModel) {
    return merge(userModel.toJSON(), {
      signup_code: this.id,
      country: Country.getCountryCode(),
    });
  },
});

export default CodeModel;



// WEBPACK FOOTER //
// ./src/js/app/models/code.js