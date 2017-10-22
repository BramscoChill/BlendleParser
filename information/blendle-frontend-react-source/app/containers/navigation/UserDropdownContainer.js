import { HELP_DESK_URL, UPSELL_STATE } from 'app-constants';
import { get } from 'lodash';
import Analytics from 'instances/analytics';
import { getRemainingDays } from 'selectors/subscriptions';
import { hasAccessToPremiumFeatures } from 'helpers/premiumEligibility';
import { getUpsellState } from 'selectors/premiumSubscriptions';
import { compose, withHandlers } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import AuthStore from 'stores/AuthStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import { getLocale } from 'instances/country';
import DefaultNavigationUserDropdown from 'components/navigation/DefaultNavigationUserDropdown';

const zendeskCountryCodes = new Map([
  ['nl_NL', 'nl'],
  ['de_DE', 'en-us'], // The Germans are redirected to the US FAQ as well
  ['en_US', 'en-us'],
]);
const UPSELL_COLOR_RED = '#FF305C';
const UPSELL_COLOR_BLUE = '#475698';

function getDropdownArrowColor(upsellState) {
  if (upsellState === UPSELL_STATE.BEFORE_TRIAL) {
    return UPSELL_COLOR_BLUE;
  }

  if (upsellState !== UPSELL_STATE.NO_UPSELL) {
    return UPSELL_COLOR_RED;
  }

  return '#FFF';
}

function getBalanceColor(balance, premiumSubscription) {
  const hasNegativeBalance = Number(balance) <= 0;

  if (hasNegativeBalance && premiumSubscription) {
    return 'cappuccino';
  }

  if (hasNegativeBalance) {
    return 'error';
  }

  return 'cash-green';
}

function mapStateToProps({ authState: { user }, premiumSubscriptionState }, ownProps) {
  const isLoggedIn = Boolean(user);
  const avatarUrl = isLoggedIn ? user.getAvatarHref() : '';
  const balance = isLoggedIn ? user.get('balance') : '';
  const premiumSubscription = premiumSubscriptionState.subscription;
  const upsellState = getUpsellState(premiumSubscriptionState);
  const arrowColor = getDropdownArrowColor(upsellState);
  const balanceColor = getBalanceColor(Number(balance), premiumSubscription);

  const locale = getLocale();
  const helpPageHref = `${HELP_DESK_URL}hc/${zendeskCountryCodes.get(locale)}`;

  const showPreferencesLink = hasAccessToPremiumFeatures(user);

  return {
    ownProps,
    avatarUrl,
    arrowColor,
    balance,
    balanceColor,
    helpPageHref,
    premiumSubscription,
    showPreferencesLink,
  };
}

mapStateToProps.stores = { AuthStore, PremiumSubscriptionStore };

const enhance = compose(
  altConnect(mapStateToProps),
  withHandlers({
    onToggleDropdown: ({ premiumSubscription }) => (isOpen) => {
      const premiumUid = get(premiumSubscription, 'uid');
      const premiumDaysRemaining = premiumSubscription && getRemainingDays(premiumSubscription);
      const eventName = isOpen ? 'User Dropdown Opened' : 'User Dropdown Closed';

      const tags = [];
      if (premiumUid && premiumSubscription.trial) {
        // only trial user
        tags.push(`${premiumUid}-active`, `${premiumUid}-${premiumDaysRemaining}-days-left`);
      } else if (!premiumUid) {
        // only non premium
        tags.push('no-trial-active', 'blendlepremium_trial-offered');
      } // else: subscribed users, no tags for them

      Analytics.track(eventName, { tags });
    },
  }),
);

export default enhance(DefaultNavigationUserDropdown);



// WEBPACK FOOTER //
// ./src/js/app/containers/navigation/UserDropdownContainer.js