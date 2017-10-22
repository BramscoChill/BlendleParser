import { compose, lifecycle } from 'recompose';
import BundlesStore from 'stores/BundlesStore';
import { translate } from 'instances/i18n';
import BundlesActions from 'actions/BundlesActions';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import { STATUS_INITIAL, STATUS_PENDING } from 'app-constants';
import { MOBILE_LAYOUT_WRAPPING } from 'modules/sectionsPage/constants';
import { tilesByIds, sortPurchased, getTileId } from 'selectors/tiles';
import altConnect from 'higher-order-components/altConnect';
import { SUGGESTION_SECTION_BUNDLE } from '../constants';

// The first bundle is always the bundle of today
const getTodaysBundle = bundlesState => bundlesState.bundles[0];

function mapStateToProps({ bundlesState, tilesState, authState }, { itemId }) {
  const bundle = getTodaysBundle(bundlesState);
  const itemIds = bundle ? bundle.itemIds.filter(bundleItemId => bundleItemId !== itemId) : [];
  const { user } = authState;
  const tiles = sortPurchased(tilesByIds(itemIds, tilesState));

  return {
    status: bundlesState.status || STATUS_INITIAL,
    userId: user.id,
    sections: [
      {
        label: translate('item.text.more_for_you'),
        type: SUGGESTION_SECTION_BUNDLE,
        itemIds: tiles.map(getTileId),
        mobileLayout: MOBILE_LAYOUT_WRAPPING,
        isLoading: bundlesState.status === STATUS_PENDING,
      },
    ],
  };
}

mapStateToProps.stores = { BundlesStore, TilesStore, AuthStore };

const actions = {
  fetchBundle: BundlesActions.fetchBundle,
};

export default compose(
  altConnect(mapStateToProps, actions),
  lifecycle({
    componentDidMount() {
      const { status, fetchBundle, userId } = this.props;

      if (status === STATUS_INITIAL) {
        fetchBundle.defer(userId);
      }
    },
  }),
);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withBundleSuggestions.js