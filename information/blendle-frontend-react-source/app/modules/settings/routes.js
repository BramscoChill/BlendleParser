import { asyncRoute } from 'helpers/routerHelpers';

function route(path, page) {
  return {
    module: 'settings',
    path,
    components: { page },
  };
}

export default [
  {
    module: 'settings',
    path: '/settings',
    getComponents: asyncRoute((nextState, cb) => {
      require.ensure(
        [],
        () => {
          cb(null, {
            overlay: require('modules/settings/containers/SettingsModuleContainer'),
          });
        },
        'settings',
      );
    }),
    indexRoute: route('', 'Profile'),
    childRoutes: [
      route('profile', 'Profile'),
      route('profile/:action', 'Profile'),
      route('emails', 'Emails'),
      route('wallet', 'Wallet'),
      route('social', 'Social'),
      route('termsandconditions', 'TermsAndConditions'),
      route('privacy', 'PrivacyStatement'),
      route('coupons', 'Coupons'),
      route('coupons/:paymentState', 'Coupons'),
      route('resetpassword', 'ResetPassword'),
      route('/settings/recurring/activate', 'RecurringActivate'),
      route('subscriptions', 'Subscriptions'),
      route('lab', 'Lab'),

      route('subscriptions/disabled', 'SubscriptionsWithDisabled'),
      route('subscriptions/callback/:provider', 'SubscriptionCallback'),
      route('subscriptions/callback/:provider/:code', 'SubscriptionCallback'),
      route('subscriptions/:provider', 'Subscriptions'),
      route('subscriptions/:provider/:status', 'SubscriptionsResult'),
    ],
  },
];



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/routes.js