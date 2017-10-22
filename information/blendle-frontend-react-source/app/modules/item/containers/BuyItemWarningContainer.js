import { compose, branch, withProps } from 'recompose';
import { withRouter } from 'react-router';
import altConnect from 'higher-order-components/altConnect';
import redirect from 'higher-order-components/redirect';
import { replaceLastPath } from 'helpers/url';
import { isBundleItem } from 'selectors/item';
import { hasAccessToPremiumFeatures } from 'helpers/premiumEligibility';
import { getTileManifest } from 'selectors/tiles';
import Analytics from 'instances/analytics';
import PaymentActions from 'actions/PaymentActions';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import isDeeplink from '../helpers/isDeeplink';
import BuyItemWarningDialog from '../components/BuyItemWarningDialog';

const track = (eventName, itemId) =>
  Analytics.track(eventName, { item_id: itemId, internal_location: 'deeplink' });

function mapStateToProps(
  { authState, itemState, tilesState },
  { balanceTooLowItemIds, dialogShownItemIds, params: { itemId }, router, location },
) {
  const { user } = authState;
  const tile = tilesState.tiles.get(itemId);
  const manifest = getTileManifest(tile);
  const hasProviderSubscription = user.hasActiveSubscription(manifest.provider.id);
  const { returnUrl } = itemState;
  const { first_name: firstName, balance, country, freeloader: isFreeloader } = user.attributes;
  const { price } = tile;
  const acquireItemPath = `${replaceLastPath(location.pathname, 'acquire')}${location.search}`;

  // redirects for premium countries
  if (
    !isDeeplink(itemId) ||
    user.hasActivePremiumSubscription() ||
    isFreeloader ||
    hasProviderSubscription ||
    location.search.includes('verified=true')
  ) {
    // This are the cases where the user dont have to pay anything (or, we wont show the dialog)
    return { redirectTo: acquireItemPath };
  }

  // not enough balance for all users before "Wanna buy" dialog is shown
  // User can also get redirected in `withItemErrorHandling` when acquire call returns 402
  if (balance <= 0) {
    // user has not enough balance to aquired this article

    if (!balanceTooLowItemIds.has(itemId)) {
      Analytics.track('Balance too low');
    }

    balanceTooLowItemIds.add(itemId);

    const successUrl = replaceLastPath(location.pathname, '');
    PaymentActions.setReturnUrl.defer(successUrl);

    const redirectTo = {
      state: {
        returnUrl,
        successUrl: `${successUrl}?verified=true`,
      },
    };

    // TODO: remove the isBundleItem check when the item will be free if user takes premium
    redirectTo.pathname =
      isBundleItem(tile) && hasAccessToPremiumFeatures(user) ? '/payment/outofbalance' : '/payment';

    return { redirectTo };
  }

  if (country !== 'NL') {
    return { redirectTo: acquireItemPath };
  }

  if (!dialogShownItemIds.has(itemId)) {
    track('Payment Needed Dialog Shown', itemId);
    dialogShownItemIds.add(dialogShownItemIds);
  }

  return {
    userAvatar: user.getAvatarHref(),
    firstName,
    balance: Number.parseFloat(balance),
    itemPrice: price / 100,
    acquireItemPath,
    handleDialogClose() {
      track('Payment Needed Dialog Dismissed', itemId);
      router.replace(returnUrl);
    },
    handleAcquireItem() {
      track('Payment Needed Dialog Accepted', itemId);
    },
  };
}

mapStateToProps.stores = { AuthStore, TilesStore, ItemStore };

export default compose(
  withRouter,
  withProps({ balanceTooLowItemIds: new Set(), dialogShownItemIds: new Set() }), // track IDs to only send events once
  altConnect(mapStateToProps),
  branch(({ redirectTo }) => !!redirectTo, redirect({ replace: true, renderNothing: true })),
)(BuyItemWarningDialog);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/BuyItemWarningContainer.js