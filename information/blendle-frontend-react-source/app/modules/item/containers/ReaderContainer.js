import PropTypes from 'prop-types';
import { compose, lifecycle, setPropTypes } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import renderNothingIfLoading from 'higher-order-components/renderNothingIfLoading';
import { PREMIUM_ALL_SUBSCRIPTION_PRODUCTS } from 'app-constants';
import zendesk from 'instances/zendesk';
import ItemStore from 'stores/ItemStore';
import ProviderStore from 'stores/ProviderStore';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import ItemActions from 'actions/ItemActions';
import { getManifest } from 'selectors/tiles';
import { isItemAcquired } from 'selectors/item';
import ensurePremiumSubscription from 'higher-order-components/ensurePremiumSubscription';
import Reader from '../components/Reader';
import withAutoRefund from '../higher-order-components/withAutoRefund';
import withItemErrorHandling from '../higher-order-components/withItemErrorHandling';
import withPrettyUri from '../higher-order-components/withPrettyUri';
import withItemAnalytics from '../higher-order-components/withItemAnalytics';
import syncReaderProgress from '../higher-order-components/syncReaderProgress';
import autoPurchaseIssue from '../higher-order-components/autoPurchaseIssue';
import loadItem from '../helpers/loadItem';
import { isReaderLoading, isContentReady } from '../helpers/readerStatus';

function mapStateToProps(
  { itemState, providerState, tilesState },
  { dialog, params, paragraphsMeasured },
) {
  const { content, selectedItemId } = itemState;
  const { status: providerStatus } = providerState;
  const manifest = getManifest(tilesState.tiles, selectedItemId);

  const isLoading = isReaderLoading({
    selectedItemId,
    manifest,
    content,
    providerStatus,
  });

  return {
    content: content.data || manifest,
    itemId: params.itemId,
    isAcquired: isItemAcquired(itemState),
    isContentReady: isContentReady(content),
    dialog,
    paragraphsMeasured,
    isLoading,
  };
}

mapStateToProps.stores = { ItemStore, ProviderStore, TilesStore };

const actions = {
  paragraphsMeasured: ItemActions.paragraphsMeasured,
};

const enhance = compose(
  ensurePremiumSubscription({
    oneOfSubscriptions: PREMIUM_ALL_SUBSCRIPTION_PRODUCTS,
    onlyActive: false,
  }),
  renderNothingIfLoading,
  withItemAnalytics,
  withAutoRefund,
  autoPurchaseIssue,
  syncReaderProgress,
  setPropTypes({
    params: PropTypes.shape({
      itemId: PropTypes.string.isRequired,
    }).isRequired,
    refundDialog: PropTypes.element,
  }),
  altConnect(mapStateToProps, actions),
  lifecycle({
    componentDidMount() {
      const { itemId } = this.props.params;

      loadItem(itemId);
      window.scrollTo(0, 0);

      setTimeout(() => {
        // Somehow this works after 2s
        zendesk.execute('hide'); // Make sure zendesk is hidden in the reader
      }, 2000);
    },
    componentWillReceiveProps(nextProps) {
      const { itemId } = nextProps.params;
      const didItemIdChange = this.props.params.itemId !== itemId;
      const didAcquisitionChange = nextProps.isAcquired !== this.props.isAcquired;

      if (didItemIdChange) {
        ItemActions.closeItem();
        loadItem(itemId);
        window.scrollTo(0, 0);
      } else if (nextProps.isAcquired && didAcquisitionChange) {
        const { user } = AuthStore.getState();

        ItemActions.fetchContent.defer(itemId, user.id);
      }
    },
    componentWillUnmount() {
      const { error } = ItemStore.getState();

      if (!error) {
        ItemActions.closeItem.defer();
      }
    },
  }),
  withItemErrorHandling,
  withPrettyUri,
);

export default enhance(Reader);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ReaderContainer.js