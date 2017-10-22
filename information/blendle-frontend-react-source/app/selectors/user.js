export const hasBundle = user => user && user.hasActivePremiumSubscription();

export const activeSubscriptions = user => user.get('active_subscriptions');

export const hasActiveSubscription = (user, providerId) =>
  activeSubscriptions(user).includes(providerId);



// WEBPACK FOOTER //
// ./src/js/app/selectors/user.js