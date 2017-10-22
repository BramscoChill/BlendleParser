import { PREMIUM_ALL_SUBSCRIPTION_PRODUCTS, STATUS_OK, STATUS_ERROR } from 'app-constants';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';
import { hasOneOfSubscriptions } from 'selectors/subscriptions';
import SubscriptionsStore from 'stores/SubscriptionsStore';
import SubscriptionsActions from 'actions/SubscriptionsActions';

function hasOneOfSubscriptionsCheck(user, subscriptionStatus = 'pending') {
  return new Promise((resolve, reject) => {
    const storeChange = ({ subscriptions, status, error }) => {
      const hasHadPremium = hasOneOfSubscriptions(
        PREMIUM_ALL_SUBSCRIPTION_PRODUCTS,
        subscriptions,
        subscriptionStatus,
      );

      if ([STATUS_OK, STATUS_ERROR].includes(status)) {
        SubscriptionsStore.unlisten(storeChange);
        resolve(hasHadPremium);
      } else if (error) {
        SubscriptionsStore.unlisten(storeChange);
        reject(error);
      }
    };

    SubscriptionsStore.listen(storeChange);
    SubscriptionsActions.fetchUserSubscriptions.defer();
  });
}

/**
 * Redirect a user to email confirm or onboarding if their account is in a certain state
 * @param {Object} user - Usermodel
 * @param {function} replace - Replace function from react-router
 * @param {function} callback - Callback from react-router onEnter
 */
export default function redirectIfOnboardingNotComplete(user, replace, callback) {
  // user.get('reads') <= 1 and not === 0 reads because when signing up
  // on deeplink you always have the article you signup up on as a read
  // thus failing this case. It's only to determine if we need to fetch subscription
  // status.
  if (user && !user.get('email_confirmed') && user.get('reads') <= 1) {
    hasOneOfSubscriptionsCheck(user)
      .then((hasPendingSubscription) => {
        if (!hasPendingSubscription) {
          replace('/getpremium/confirm');
        }

        callback();
      })
      .catch(error => callback(error));
  }

  // Always redirect users to the premium onboarding when they have a premium subscription
  // But don't have the did_premium_onboarding pref, as it is required for first bundle
  if (
    user &&
    // in US/DE all people should go to the 'premium' onboarding,
    // otherwise they won't get a bundle on the new timeline
    // also discussed with Rick: we'll change this flow in Q4 2017
    (user.hasActivePremiumSubscription() || !countryEligibleForPremium()) &&
    !user.getPreference('did_premium_onboarding')
  ) {
    replace({
      pathname: '/preferences/channels',
      state: {
        isOnboarding: true,
      },
    });
    callback();
  }
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/redirectIfOnboardingNotComplete.js