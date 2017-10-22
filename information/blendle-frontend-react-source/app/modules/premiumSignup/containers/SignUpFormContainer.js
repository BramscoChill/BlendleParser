import { string, oneOf, bool } from 'prop-types';
import altConnect from 'higher-order-components/altConnect';
import { compose, setPropTypes } from 'recompose';
import withRouter from 'react-router/lib/withRouter';
import { once } from 'lodash';
import {
  HOME_ROUTE,
  SIGNUP_TYPE_PREMIUM_ONBOARDING,
  SIGNUP_TYPE_DEEPLINK,
  SIGNUP_TYPE_AFFILIATE,
  SIGNUP_PLATFORM_FACEBOOK,
} from 'app-constants';
import SignUpStore from 'stores/SignUpStore';
import AuthStore from 'stores/AuthStore';
import AffiliatesStore from 'stores/AffiliatesStore';
import ExperimentsStore from 'stores/ExperimentsStore';
import { assignExperimentVariant } from 'helpers/experiments';
import Auth from 'controllers/auth';
import { shouldGetAutoRenewTrial } from 'helpers/premiumEligibility';
import { getBaseUrl } from 'helpers/baseUrl';
import { getSuccesOrOnboardingUrl, getRoute, getOnboardingRoute } from 'helpers/onboarding';
import { getCustomCopy, getSignUpAffiliateMetaData } from 'helpers/affiliates';
import SignUpForm from 'modules/premiumSignup/components/SignUpForm';
import SignUpActions from 'actions/SignUpActions';
import ApplicationState from 'instances/application_state';
import googleAnalytics from 'instances/google_analytics';
import Analytics from 'instances/analytics';
import { getSessionItemId } from 'modules/item/helpers/isDeeplink';
import { track, shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';
import { DeeplinkOnboardingSkipProviderStep } from 'config/runningExperiments';

function trackGA(instance, pathname, action, label, value) {
  if (shouldTrackGAClickEvent(pathname)) {
    instance.trackEvent(pathname, action, label, value);
  }
}

const trackers = new Map([
  ['firstname', { event: 'Signup/First name', track: once(track) }],
  ['email', { event: 'Signup/Email', track: once(track) }],
  ['password', { event: 'Signup/Password', track: once(track) }],
]);

function onFacebookError({ message }, locationInLayout) {
  track(Analytics, 'Connect Facebook Error', {
    location_in_layout: locationInLayout,
    error: message,
  });
}

function onFacebookOpen(locationInLayout) {
  track(Analytics, 'Connect Facebook Start', {
    location_in_layout: locationInLayout,
  });
}

function onFacebookSignup(router, shouldGet2ctTrial) {
  SignUpActions.setSignupPlatform(SIGNUP_PLATFORM_FACEBOOK);

  if (shouldGet2ctTrial) {
    router.push('/payment/subscription/blendlepremium_one_week_auto_renewal');
  } else {
    router.push(getOnboardingRoute(window.location.pathname));
  }

  trackGA(googleAnalytics, window.location.pathname, 'button', 'facebook signup');
}

function onFacebookLogin(user, router) {
  const returnUrl = ApplicationState.get('requireAuthUrl') || '/';

  router.push(getSuccesOrOnboardingUrl(user, returnUrl));

  trackGA(googleAnalytics, window.location.pathname, 'button', 'facebook login');
}

function onUserformInput({ name, value }, locationInLayout, userInput) {
  SignUpActions.signUpFormChange({
    ...userInput,
    [name]: value,
  });

  const tracker = trackers.get(name);

  if (value && tracker) {
    tracker.track(Analytics, tracker.event, {
      location_in_layout: locationInLayout,
    });
  }
}

export function getSuccessUrl(itemId, affiliate) {
  const baseUrl = getBaseUrl();
  const defaultSuccess = `${baseUrl}${HOME_ROUTE}/success`;

  return itemId
    ? `${baseUrl}/item/${itemId}?verified=true`
    : getRoute(`${defaultSuccess}?affiliate=:affiliateId`, defaultSuccess, affiliate);
}

function getAnalyticsSignUpType(itemId, affiliate, signupType) {
  if (signupType) return signupType;
  if (itemId) return SIGNUP_TYPE_DEEPLINK;
  if (affiliate) return SIGNUP_TYPE_AFFILIATE;

  return SIGNUP_TYPE_PREMIUM_ONBOARDING;
}

export function getAffiliateMetaAndSignupType(itemId, affiliatesState, shouldGet2ctTrial) {
  return shouldGet2ctTrial && !itemId
    ? { signup_type: 'subscription' }
    : getSignUpAffiliateMetaData(affiliatesState);
}

function getBaseSignUpContext(itemId = null, storeContext, metaData) {
  return {
    entry_item: itemId,
    referrer: 'https://blendle.com/getpremium',
    ...storeContext,
    ...metaData,
  };
}

function onSubmit(
  userFormValues,
  signUpAnalyticsPayload,
  analyticsSignUpType,
  signUpContext,
  isDeeplink,
) {
  trackGA(googleAnalytics, window.location.pathname, 'button', 'start je gratis week');

  if (isDeeplink) {
    assignExperimentVariant(
      DeeplinkOnboardingSkipProviderStep,
      ExperimentsStore.getState(),
      Auth.getUser(),
    );
  }

  const { email, firstname: first_name, password } = userFormValues;
  const options = {
    verifyEmail: false,
    analyticsPayload: signUpAnalyticsPayload,
    signUpType: analyticsSignUpType,
  };
  const context = {
    first_name,
    password,
    ...signUpContext,
  };

  SignUpActions.signUp(email, context, options);
}

const mapStateToProps = (
  { signUpState, affiliatesState, experimentsState, authState },
  ownProps,
) => {
  const { status: signupStatus, error, userInput: userFormValues, context } = signUpState;
  const { user } = authState;
  const { affiliate } = affiliatesState;
  const {
    buttonText,
    locationInLayout,
    autoFocus,
    disabled,
    signUpType: signUpTypeFromProps,
    router,
  } = ownProps;
  const itemId = ownProps.itemId || getSessionItemId();
  const customCopy = getCustomCopy('signUp', affiliate);
  const isDeeplink = !!itemId;
  const successUrl = getSuccessUrl(itemId, affiliate);
  const shouldGet2ctTrial = shouldGetAutoRenewTrial(!!itemId);
  const analyticsSignUpType =
    signUpTypeFromProps || getAnalyticsSignUpType(itemId, affiliate, signUpTypeFromProps);
  const signUpMetaData = getAffiliateMetaAndSignupType(itemId, affiliatesState, shouldGet2ctTrial);
  const signUpContext = {
    ...getBaseSignUpContext(itemId, context, signUpMetaData),
    success_url: successUrl,
  };

  const signUpAnalyticsPayload = {
    item_id: itemId,
    location_in_layout: locationInLayout,
  };

  if (isDeeplink && !customCopy.buttonText) {
    customCopy.buttonText = 'Lees dit artikel gratis';
  }

  if (buttonText) {
    customCopy.buttonText = buttonText;
  }

  return {
    error,
    signupStatus,
    disabled,
    userFormValues,
    locationInLayout,
    autoFocus,
    ...customCopy,
    signUpType: analyticsSignUpType,
    facebookSignUpContext: signUpContext,
    onFacebookError: fbError => onFacebookError(fbError, locationInLayout),
    onFacebookOpen: () => onFacebookOpen(locationInLayout),
    onFacebookSignUp: () => onFacebookSignup(router, shouldGet2ctTrial),
    onUserFormInput: e => onUserformInput(e, locationInLayout, userFormValues),
    onFacebookLogin: () => onFacebookLogin(user, router),
    onSubmit: () => {
      onSubmit(
        userFormValues,
        signUpAnalyticsPayload,
        analyticsSignUpType,
        signUpContext,
        isDeeplink,
      );
    },
  };
};
mapStateToProps.stores = { SignUpStore, AffiliatesStore, ExperimentsStore, AuthStore };

const enhance = compose(
  setPropTypes({
    itemId: string,
    signupType: string,
    disabled: bool,
    buttonText: string,
    locationInLayout: oneOf(['inline_form', 'signup_dialog']).isRequired,
    autoFocus: bool,
  }),
  withRouter,
  altConnect(mapStateToProps),
);

export default enhance(SignUpForm);



// WEBPACK FOOTER //
// ./src/js/app/modules/premiumSignup/containers/SignUpFormContainer.js