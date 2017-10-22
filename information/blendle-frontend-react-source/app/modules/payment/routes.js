import { getReturnUrl, asyncRoute } from 'helpers/routerHelpers';
import { PREMIUM_PAID_SUBSCRIPTION_PRODUCTS } from 'app-constants';

function onEnter() {
  document.body.classList.add('m-payment');
}

function onLeave() {
  document.body.classList.remove('m-payment');
}
function route(path, dialogueHandler) {
  return {
    module: 'payment',
    path,
    onEnter,
    onLeave,
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          const paymentModule = require('./module');
          const returnUrl = getReturnUrl(path, nextState.location.state);
          cb(null, {
            dialogue: dialogueHandler.bind(
              null,
              paymentModule,
              returnUrl,
              nextState.params,
              nextState.location.state,
            ),
          });
        },
        'payment',
      );
    }),
  };
}

const premiumSubscriptionSuccessRoutes = PREMIUM_PAID_SUBSCRIPTION_PRODUCTS.map(product =>
  route(`payment/success/subscription/${product}`, (mod, returnUrl) =>
    mod.openPremiumPaymentResult(returnUrl, 'success', product),
  ),
);

const premiumSubscriptionRoutes = PREMIUM_PAID_SUBSCRIPTION_PRODUCTS.map(product =>
  route(`payment/subscription/${product}`, (mod, returnUrl) =>
    mod.openPremiumSubscription(product, returnUrl),
  ),
);

export default [
  route('payment', (mod, returnUrl) => mod.openPayment(returnUrl)),
  route('payment/success', (mod, returnUrl) => mod.openPaymentResult(returnUrl, 'success')),
  route('payment/pending', (mod, returnUrl) => mod.openPaymentResult(returnUrl, 'pending')),
  route('payment/cancelled', (mod, returnUrl) => mod.openPaymentResult(returnUrl, 'cancelled')),
  route('payment/outofbalance', (mod, returnUrl, params, nextLocationState) =>
    mod.openOutOfBalance(returnUrl, nextLocationState),
  ),
  ...premiumSubscriptionSuccessRoutes,
  route('payment/success/subscription/:subscriptionProductId', (mod, returnUrl, params) =>
    mod.openSubscriptionPaymentResult(returnUrl, 'success', params.subscriptionProductId),
  ),
  ...premiumSubscriptionRoutes,
  route('payment/subscription/:productId', (mod, returnUrl, params) =>
    mod.openSubscription(returnUrl, params.productId),
  ),
  route('payment/recurring', (mod, returnUrl) => mod.openPaymentRecurring(returnUrl)),
  route('payment/recurring/activate', (mod, returnUrl) =>
    mod.openPaymentRecurring(returnUrl, true),
  ),
];



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/routes.js