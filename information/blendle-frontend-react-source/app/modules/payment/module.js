import React from 'react';
import { get } from 'lodash';
import Auth from 'controllers/auth';
import Analytics from 'instances/analytics';
import AltContainer from 'alt-container';
import { HOME_ROUTE } from 'app-constants';
import PaymentActions from 'actions/PaymentActions';
import TopUpActions from 'actions/TopUpActions';
import TopUpStore from 'stores/TopUpStore';
import SubscriptionActions from 'actions/SubscriptionsActions';
import SubscriptionsStore from 'stores/SubscriptionsStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import OutOfBalanceDialogContainer from 'modules/payment/containers/OutOfBalanceDialogContainer';
import AuthStore from 'stores/AuthStore';
import PaymentResultDialogue from 'components/dialogues/PaymentResult';
import PremiumResultDialogue from 'components/dialogues/PremiumPaymentResult';
import PaymentSubscriptionResultDialogue from 'components/dialogues/PaymentSubscriptionResult';
import PaymentRecurringDialogue from 'components/dialogues/PaymentRecurring';
import SubscriptionContainer from 'modules/payment/SubscriptionContainer';
import PremiumSubscriptionContainer from 'modules/payment/PremiumSubscriptionContainer';
import TopUpContainer from 'modules/payment/TopUpContainer';
import Cookies from 'cookies-js';
import { history } from 'byebye';

function getPaymentCookie() {
  try {
    const payment = Cookies.get('paymentRequest');
    if (payment) {
      return JSON.parse(payment);
    }
    return {};
  } catch (err) {
    return {};
  }
}

function clearPaymentCookie() {
  Cookies.expire('paymentRequest');
}

function onCloseSuccess(returnUrl) {
  return () => {
    const paymentCookie = getPaymentCookie();
    clearPaymentCookie();
    history.navigate(paymentCookie.returnUrl || returnUrl || '/', { trigger: true, replace: true });
  };
}

function onClose(routerReturnUrl) {
  return () => {
    history.navigate(routerReturnUrl || '/', { trigger: true });
  };
}

export function openPremiumSubscription(product, returnUrl) {
  return (
    <PremiumSubscriptionContainer subscriptionProductId={product} onClose={onClose(returnUrl)} />
  );
}

export function openSubscription(returnUrl, subscriptionProductId) {
  return (
    <SubscriptionContainer
      subscriptionProductId={subscriptionProductId}
      onClose={onClose(returnUrl)}
    />
  );
}

export function openPayment(returnUrl) {
  const user = Auth.getUser();

  TopUpActions.resetState();
  PaymentActions.fetchPaymentMethods(user);

  Analytics.track('Start Payment', { balance: user.get('balance') });

  return <TopUpContainer onClose={onClose(returnUrl)} />;
}

export function openOutOfBalance(returnUrl, params) {
  return (
    <OutOfBalanceDialogContainer
      onDialogClosed={onClose(returnUrl)}
      successUrl={get(params, 'successUrl', '/')}
      onClose={onClose(returnUrl)}
    />
  );
}

export function openPaymentResult(returnUrl, condition) {
  Analytics.track(`Payment Result:${condition}`, getPaymentCookie());

  return (
    <AltContainer
      store={TopUpStore}
      render={store => (
        <PaymentResultDialogue
          user={Auth.getUser()}
          condition={condition}
          onClose={onCloseSuccess()}
        />
      )}
    />
  );
}

function trackSubscriptionSuccess() {
  const payment = getPaymentCookie();

  if (payment) {
    Analytics.track('Subscription Started', payment);
    clearPaymentCookie(); // Clear to prevent double events
  }
}

export function openPremiumPaymentResult(returnUrl, condition, subscriptionProductId) {
  const user = AuthStore.getState().user;
  SubscriptionActions.pollFetchUserSubscription(subscriptionProductId, user.id);
  trackSubscriptionSuccess();

  return (
    <AltContainer
      store={PremiumSubscriptionStore}
      render={({ status }) => (
        <PremiumResultDialogue
          name={Auth.getUser().getFirstName()}
          condition={condition}
          onClose={onClose(HOME_ROUTE)}
          status={status}
        />
      )}
    />
  );
}

export function openSubscriptionPaymentResult(returnUrl, condition, subscriptionProductId) {
  SubscriptionActions.pollFetchUserSubscription(subscriptionProductId, Auth.getId());
  trackSubscriptionSuccess();

  return (
    <AltContainer
      store={SubscriptionsStore}
      render={(store) => {
        const subscription = store.subscriptions.find(s => s.uid === subscriptionProductId);
        let providerUid;
        if (subscription) {
          providerUid = subscription.provider.uid;
        }

        return (
          <PaymentSubscriptionResultDialogue
            condition={condition}
            onClose={onClose(providerUid ? `issue/${providerUid}` : returnUrl)}
            providerUid={providerUid}
            status={store.status}
          />
        );
      }}
    />
  );
}

export function openPaymentRecurring(returnUrl) {
  const user = Auth.getUser();
  PaymentActions.setRecurringContract(user, true);
  Analytics.track('Enabled Recurring Contract');

  return <PaymentRecurringDialogue user={Auth.getUser()} onClose={onClose(returnUrl)} />;
}



// WEBPACK FOOTER //
// ./src/js/app/modules/payment/module.js