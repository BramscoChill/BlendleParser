import altConnect from 'higher-order-components/altConnect';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import { compose } from 'recompose';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import { getUpsellState } from 'selectors/premiumSubscriptions';
import { STATUS_PENDING, UPSELL_STATE } from 'app-constants';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';

function mapStateToProps({ premiumSubscriptionState }, ownProps) {
  const { status, subscription } = premiumSubscriptionState;

  const shouldRenderUpsell = countryEligibleForPremium() && status !== STATUS_PENDING;
  const upsellState = getUpsellState(premiumSubscriptionState);

  return {
    isHidden: !shouldRenderUpsell || upsellState === UPSELL_STATE.NO_UPSELL,
    upsellState,
    premiumSubscription: subscription,
    ...ownProps,
  };
}

mapStateToProps.stores = { PremiumSubscriptionStore };

export default compose(altConnect(mapStateToProps), renderNothingIfIsHidden);



// WEBPACK FOOTER //
// ./src/js/app/higher-order-components/withUpsellState.js