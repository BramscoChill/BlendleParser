import { Model } from 'byebye';
import { providerById, prefillSelector } from 'selectors/providers';

const PayItem = Model.extend({
  name: 'pay_item',
  mappings: {
    'b:metadata': { resource: Model },
  },

  getParts() {
    const parts = this.get('uid').split('-');
    return {
      supplierUID: parts[0],
      providerUID: parts[1],
      datetime: parts[2],
      custom: parts[3],
    };
  },

  getUrl() {
    const meta = this.get('b:metadata');
    return this.get('url') || (meta ? meta.get('url') : null);
  },

  getProvider() {
    return prefillSelector(providerById)(this.getParts().providerUID);
  },
});

export default PayItem;



// WEBPACK FOOTER //
// ./src/js/app/models/PayItem.js