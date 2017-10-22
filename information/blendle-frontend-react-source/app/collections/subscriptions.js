import { Collection } from 'byebye';
import Subscription from 'models/subscription';

const Subscriptions = Collection.extend({
  model: Subscription,
  collectionKeyString: '_embedded.provider_accounts',
});

export default Subscriptions;



// WEBPACK FOOTER //
// ./src/js/app/collections/subscriptions.js