import Analytics from 'instances/analytics';
import googleAnalytics from 'instances/google_analytics';
import AuthStore from 'stores/AuthStore';
import SignUpStore from 'stores/SignUpStore';
import { track, shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';
import { SIGNUP_PLATFORM_FACEBOOK, REDIRECT_TO_URL } from 'app-constants';
import { shouldTrackLead, trackLead } from 'instances/tradetracker';
import BundlesActions from 'actions/BundlesActions';
import ApplicationActions from 'actions/ApplicationActions';

function trackOnNext(user) {
  track(Analytics, 'Signup/Onboarding Completed');

  const { pathname } = window.location;
  if (shouldTrackGAClickEvent(pathname)) {
    googleAnalytics.trackEvent(pathname, 'button', 'ga door');
  }

  if (shouldTrackLead()) {
    trackLead(user.get('tracking_uid'));
  }
}

/**
 * Finishes the sign up process, tracking and redirect stuff
 *
 * @export
 * @param {string} itemId
 */
export default function finishSignup(itemId) {
  const { user } = AuthStore.getState();
  const { platform } = SignUpStore.getState();

  // Workaround to redirect to the item after signup
  if (platform === SIGNUP_PLATFORM_FACEBOOK && !!itemId) {
    ApplicationActions.set(REDIRECT_TO_URL, `/item/${itemId}?verified=true`);
  }

  trackOnNext(user);

  user.savePreferences({
    did_onboarding: true,
    did_premium_onboarding: true,
  });

  BundlesActions.fetchBundle(user.id);
}



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/helpers/finishSignup.js