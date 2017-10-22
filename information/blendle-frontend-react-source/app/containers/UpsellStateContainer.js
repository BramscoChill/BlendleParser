import { UPSELL_STATE } from 'app-constants';
import withUpsellState from 'higher-order-components/withUpsellState';

function UpsellStateContainer({
  renderBeforeTrial,
  renderDuringTrial,
  renderAfterSubscription,
  upsellState,
  premiumSubscription: subscription,
}) {
  if (renderBeforeTrial && upsellState === UPSELL_STATE.BEFORE_TRIAL) {
    return renderBeforeTrial({ subscription });
  }

  if (renderDuringTrial && upsellState === UPSELL_STATE.DURING_EXPIRING_TRIAL) {
    return renderDuringTrial({ subscription });
  }

  if (renderAfterSubscription && upsellState === UPSELL_STATE.ENDED_SUBSCRIPTION) {
    return renderAfterSubscription({ subscription });
  }

  return null;
}

export default withUpsellState(UpsellStateContainer);



// WEBPACK FOOTER //
// ./src/js/app/containers/UpsellStateContainer.js