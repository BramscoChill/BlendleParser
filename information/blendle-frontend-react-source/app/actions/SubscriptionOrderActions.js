import alt from 'instances/altInstance';
import { XHR_STATUS, ORDER_REFUSED } from 'app-constants';
import Analytics from 'instances/analytics';
import PaymentManager from 'managers/payment';
import SubscriptionsManager from 'managers/subscriptions';
import i18n from 'instances/i18n';
import Cookies from 'cookies-js';
import { history } from 'byebye';
import PaymentActions from 'actions/PaymentActions';
import SubscriptionProductsActions from 'actions/SubscriptionProductsActions';
import { get } from 'lodash';
import { PREMIUM_ONE_WEEK_AUTO_RENEWAL } from 'app-constants';
import { getSelectedRecurringContract } from 'selectors/payment';
import TypedError from 'helpers/typederror';

export default alt.createActions({
  name: 'SubscriptionOrderActions',

  directPayment(recurringContract, product, jwt) {
    PaymentManager.fetchOrderURL({ recurring_contract_id: recurringContract, payment: jwt })
      .then((order) => {
        if (order.status === 'refused') {
          return Promise.reject(new TypedError(ORDER_REFUSED, 'Order refused'));
        }
        this.directPaymentSuccess(product, order);
        return Promise.resolve();
      })
      .catch((error) => {
        this.directPaymentError(error);

        if (error.type !== ORDER_REFUSED) {
          throw error;
        }
      });

    return null;
  },

  directPaymentSuccess(product, order) {
    const successUrl = `payment/success/subscription/${product.uid}`;
    Cookies.set(
      'paymentRequest',
      JSON.stringify({
        provider_id: product.provider_uid,
        subscription_product_uid: product.uid,
        order_uuid: order.uuid,
      }),
    );

    history.navigate(successUrl, { trigger: true, replace: true });

    return null;
  },

  directPaymentError(error) {
    Analytics.track('Provider Subscription/Payment Request Error', {
      error: error.message,
    });

    return error;
  },

  fetchSubscriptionPaymentURL(paymentState, product, jwt, user, options = {}) {
    // User wants to pay with a recurring contract
    if (getSelectedRecurringContract(paymentState)) {
      this.fetchSubscriptionPaymentURLSuccess.defer(paymentState, null, product);

      return null;
    }

    const paymentOptions = {
      success_url: options.successUrl || `payment/success/subscription/${product.uid}`,
      pending_url: 'payment/pending',
      cancel_url: 'payment/cancelled',
      payment: jwt,
    };

    if (paymentState && paymentState.selectedBanks[paymentState.selectedPaymentMethod]) {
      paymentOptions.bank = paymentState.selectedBanks[paymentState.selectedPaymentMethod];
    }

    if (paymentState && paymentState.selectedPaymentMethod) {
      paymentOptions.method = paymentState.selectedPaymentMethod;
    }

    user.savePreferences({
      last_payment_method: paymentOptions.method,
      last_bank: paymentOptions.bank,
    });

    PaymentManager.fetchOrderURL(paymentOptions)
      .then((response) => {
        const paymentURL = get(response, '_links.payment.href', null);
        if (paymentURL) {
          this.fetchSubscriptionPaymentURLSuccess(paymentState, paymentURL, product, response.uuid);
        } else {
          this.fetchSubscriptionPaymentURLError(new Error('No PaymentURL'));
        }
      })
      .catch((error) => {
        this.fetchSubscriptionPaymentURLError(error);
        throw error;
      });

    return null;
  },

  fetchSubscriptionPaymentURLSuccess(paymentState, paymentURL, product, orderUuid) {
    const bank = { bank: paymentState.selectedBanks[paymentState.selectedPaymentMethod] };

    const providerId = product.provider_uid;
    const price = product._embedded['b:tier']._embedded['b:tier-prices'].find(
      tier => tier.currency === i18n.currentCurrency,
    ).amount;

    const options = {
      method: paymentState.selectedPaymentMethod,
      recurring: paymentState.recurring_contracts.length > 0,
      offer: price,
      provider_id: providerId,
      subscription_product_uid: product.uid,
      order_uuid: orderUuid,
    };

    if (bank && bank.bank !== '0') {
      options.bank = bank.bank;
    }

    Cookies.set('paymentRequest', JSON.stringify(options));
    Analytics.track('Provider Subscription/Payment Request', options);

    return { paymentURL, activeStep: 'confirmation' };
  },

  fetchSubscriptionPaymentURLError(error) {
    Analytics.track('Provider Subscription/Payment Request Error', {
      error: error.message,
    });

    return error;
  },

  setActiveStep: x => x,

  createOrder({ subscriptionProductId, paymentType, ...rest }, userId) {
    return (dispatch) => {
      dispatch();

      return SubscriptionsManager.createOrder(
        { subscriptionProductId, paymentType, ...rest },
        userId,
      ).then(this.createOrderSuccess);
    };
  },

  /**
   * Retry is called when payment jwt is expired
   * Fetches a new payment jwt and purchase the subscription
   */
  retry(paymentState, product, user) {
    const subscriptionProductId = product.uid;
    Analytics.track('Provider Subscription/Subscription Upgrade Retry');

    this.createOrder({ subscriptionProductId, paymentType: 'direct' }, user.id)
      .then((jwt) => {
        // User wants to pay with a recurring contract
        if (getSelectedRecurringContract(paymentState)) {
          this.directPayment(paymentState.selectedPaymentMethod, product, jwt);
        } else {
          this.fetchSubscriptionPaymentURL(paymentState, product, jwt, user);
        }
      })
      .catch((error) => {
        Analytics.track('Provider Subscription/Subscription Upgrade Retry Error', {
          error: error.message,
        });

        throw error;
      });

    return null;
  },

  /**
   * Aggregates fetching of paymentMethods, recurring, product, order
   */
  startSubscriptionOrder(user, subscriptionProductId) {
    Promise.all([
      PaymentActions.fetchPaymentMethods(user),
      SubscriptionProductsActions.fetchProduct(subscriptionProductId),
    ])
      .then(([paymentMethods, product]) =>
        this.createOrder({ subscriptionProductId, paymentType: 'direct' }, user.id).then(order => [
          paymentMethods,
          product,
          order,
        ]),
      )
      .then(([paymentMethods, product]) => {
        const providerId = product.provider_uid;
        const price = product._embedded['b:tier']._embedded['b:tier-prices'].find(
          tier => tier.currency === i18n.currentCurrency,
        ).amount;

        /*
         * Don't register this as an upgrade for the one week auto renew subscription
         * as this is technically a trial, but the trial=true flag sends a lot of upsell emails
         * which are NOT neccessary for this prodcut
         */
        if (subscriptionProductId !== PREMIUM_ONE_WEEK_AUTO_RENEWAL) {
          Analytics.track('Provider Subscription/Subscription Upgrade Started', {
            provider_id: providerId,
            subscription_product_uid: product.uid,
            offer: price,
            recurring: paymentMethods.recurring_contracts.length > 0,
          });
        }
        Analytics.track('Provider Subscription/Select Payment Method', {
          provider_id: providerId,
          subscription_product_uid: product.uid,
          offer: price,
          recurring: paymentMethods.recurring_contracts.length > 0,
        });
      })
      .catch((error) => {
        Analytics.track('Provider Subscription/Subscription Upgrade Error', {
          error: error.message,
        });

        throw error;
      });

    return null;
  },

  createOrderSuccess: x => x,

  /**
   Creates order at subscription microservice
   Exchanges given jwt to core
   Poll to subscription microservice for result
   */
  startTrial(options, userId) {
    this.createOrder(options, userId)
      .then(jwt => PaymentManager.fetchOrderURL({ payment: jwt }))
      .then((order) => {
        Analytics.track('Subscription Started', {
          subscription_product_uid: options.subscriptionProductId,
          order_uuid: order.uuid,
          ...options.analyticsPayload,
        });

        return this.startTrialSuccess(options.subscriptionProductId);
      })
      .then(() => {
        const successUrl =
          options.success_url || `/payment/success/subscription/${options.subscriptionProductId}`;

        if (options.onSuccess) {
          options.onSuccess();
          return Promise.resolve();
        }

        return history.navigate(successUrl, { trigger: true });
      })
      .catch((error) => {
        Analytics.track('Provider Subscription/Subscription Error', {
          subscription_product_uid: options.subscriptionProductId,
          error: error.message,
          ...options.analyticsPayload,
        });

        this.startTrialFailure(error);

        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return null;
  },

  startTrialSuccess: x => x,
  startTrialFailure: x => x,

  startAffiliateSubscription(options, userId) {
    const optionsWithAcceptHeader = {
      ...options,
      acceptHeader: 'application/json',
    };

    this.createOrder(optionsWithAcceptHeader, userId)
      .then(() => this.startAffiliateSubscriptionSuccess(options.subscriptionProductId))
      .catch(error => this.startAffiliateSubscriptionFailure(error));

    return null;
  },

  startAffiliateSubscriptionSuccess: x => x,
  startAffiliateSubscriptionFailure: x => x,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/SubscriptionOrderActions.js