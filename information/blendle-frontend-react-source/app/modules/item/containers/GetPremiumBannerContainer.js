import React, { PureComponent } from 'react';
import { bool } from 'prop-types';
import { isMobile } from 'instances/browser_environment';
import AltContainer from 'alt-container';
import { memoize } from 'lodash';
import ItemStore from 'stores/ItemStore';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import browserHistory from 'react-router/lib/browserHistory';
import { getRemainingDays } from 'selectors/subscriptions';
import { isBundleItem } from 'selectors/item';
import UpsellStateContainer from 'containers/UpsellStateContainer';
import { PREMIUM_PROVIDER_ID } from 'app-constants';
import { countryEligibleForPremium } from 'helpers/premiumEligibility';
import PremiumRunningTrialBanner from '../components/PremiumRunningTrialBanner';

const getAnalytics = memoize(itemId => ({
  internal_location: 'item',
  item_id: itemId,
}));

class GetPremiumBannerContainer extends PureComponent {
  static propTypes = {
    shouldCheckItemConditions: bool,
    shouldHideOnMobile: bool,
  };

  static defaultProps = {
    shouldCheckItemConditions: true,
    shouldHideOnMobile: true,
  };

  _onClickUpsell = () => {
    browserHistory.push(`/subscription/${PREMIUM_PROVIDER_ID}`);
  };

  // eslint-disable-next-line react/prop-types
  _renderTrailBanner = itemId => ({ subscription }) => (
    <PremiumRunningTrialBanner
      onClickCta={this._onClickUpsell}
      remainingDays={getRemainingDays(subscription)}
      analytics={{ ...getAnalytics(itemId), ...this.props.analytics }}
    />
  );

  // eslint-disable-next-line react/prop-types
  _renderUpsellContainer = ({ itemState, authState, tilesState }) => {
    const { selectedItemId } = itemState;
    const tile = tilesState.tiles.get(selectedItemId);
    const { user: { attributes: { reads } } } = authState;
    const isFourthElement = reads % 4 === 0;

    if (
      !this.props.shouldCheckItemConditions ||
      ((tile && isBundleItem(tile)) || isFourthElement)
    ) {
      return <UpsellStateContainer renderDuringTrial={this._renderTrailBanner(selectedItemId)} />;
    }

    return null;
  };

  render() {
    if ((this.props.shouldHideOnMobile && isMobile()) || !countryEligibleForPremium()) {
      return null;
    }

    return (
      <AltContainer
        stores={{
          itemState: ItemStore,
          authState: AuthStore,
          tilesState: TilesStore,
        }}
        render={this._renderUpsellContainer}
      />
    );
  }
}

export default GetPremiumBannerContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/GetPremiumBannerContainer.js