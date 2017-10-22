import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import withRouter from 'react-router/lib/withRouter';
import altConnect from 'higher-order-components/altConnect';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import AuthStore from 'stores/AuthStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import AuthActions from 'actions/AuthActions';
import features from 'config/features';
import { PREMIUM_TRIAL_PRODUCT, STATUS_OK, HOME_ROUTE } from 'app-constants';
import { status as statusPropType } from 'libs/propTypes';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';
import { getParams } from 'helpers/url';
import SubscriptionOrderStore from 'stores/SubscriptionOrderStore';
import SubscriptionOrderActions from 'actions/SubscriptionOrderActions';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import PremiumTrialDialog from 'components/dialogues/PremiumTrialDialog';
import { navigationAnalytics } from 'selectors/moduleNavigation';

const IGNORE_PATH_REGEX = /login-email|getpremium/i; // TODO: Remove this hack

class PremiumTrialDialogContainer extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    trialStatus: statusPropType.isRequired,
    successUrl: PropTypes.string,
    onClose: PropTypes.func,
    user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    successUrl: `${HOME_ROUTE}/success`,
    onClose: () => {},
  };

  _saveDismissUserPref(user) {
    user
      .savePreferences({ did_dismiss_premium_launch_dialog: true })
      .then(() => AuthActions.update(user));
  }

  _onDialogClose = (user) => {
    this._saveDismissUserPref(user);
    this.props.onClose();
  };

  _onSubscription = (user) => {
    this._saveDismissUserPref(user);
    SubscriptionOrderActions.startTrial(
      {
        onSuccess: () => {
          const state = {
            returnUrl: this.props.successUrl,
            isOnboarding: true,
          };

          // Return to article with confetti
          if (/^(\/i\/|\/item\/)/.test(window.location.pathname)) {
            state.returnUrl = `${window.location.pathname}?verified=true`;
          }

          this.props.router.push({
            pathname: '/preferences/channels',
            state,
          });
        },
        paymentType: 'confirmed_email_address',
        subscriptionProductId: PREMIUM_TRIAL_PRODUCT,
        analyticsPayload: {
          internal_location: 'upsell_dialog',
          ...navigationAnalytics(ModuleNavigationStore),
        },
      },
      user.id,
    );
  };

  render() {
    // Check if user comes from premium launch invite mail
    const { trialStatus, user } = this.props;

    const urlParams = getParams({ useSearch: true });
    const shouldSkipExplanation = urlParams.skip_launch_dialogs === 'true';

    return (
      <PremiumTrialDialog
        user={user}
        onClose={this._onDialogClose}
        status={trialStatus}
        shouldSkipExplanation={shouldSkipExplanation}
        onConfirmTrial={this._onSubscription}
      />
    );
  }
}

function mapStateToProps(
  { authState, subscriptionOrderState, premiumSubscriptionState },
  { forceShow, onClose, successUrl },
) {
  const { user } = authState;
  const { trialStatus } = subscriptionOrderState;
  const userHasNoPremium =
    premiumSubscriptionState.error && premiumSubscriptionState.error.status === 404; // 404 on a subscription call means there's never been a premium subscription

  const userDismissedDialog = user && user.getPreference('did_dismiss_premium_launch_dialog');

  const userIsNotElegibleForTrial =
    !user ||
    !user.get('email_confirmed') ||
    userDismissedDialog ||
    !userHasNoPremium ||
    trialStatus === STATUS_OK ||
    user.attributes.reads === 0;

  const isHidden =
    !features.blendlePremium ||
    !countryEligibleForPremium() ||
    (userIsNotElegibleForTrial && !forceShow) ||
    IGNORE_PATH_REGEX.test(window.location.pathname);

  return {
    isHidden,
    user,
    trialStatus,
    onClose,
    successUrl,
  };
}

mapStateToProps.stores = { AuthStore, SubscriptionOrderStore, PremiumSubscriptionStore };

const enhance = compose(withRouter, altConnect(mapStateToProps), renderNothingIfIsHidden);

export default enhance(PremiumTrialDialogContainer);



// WEBPACK FOOTER //
// ./src/js/app/containers/dialogues/PremiumTrialDialogContainer.js