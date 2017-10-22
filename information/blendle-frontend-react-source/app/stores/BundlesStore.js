import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import BundlesActions from 'actions/BundlesActions';
import { getItemId } from 'selectors/item';

class BundlesStore {
  constructor() {
    this.bindActions(BundlesActions);

    this.state = {
      status: STATUS_INITIAL,
      bundles: [],
    };
  }

  onFetchBundle() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onFetchBundleSuccess({ bundle }) {
    const swapRecommendation = bundle._links['b:swap-recommendation'];
    this.setState({
      bundles: [
        ...this.state.bundles,
        {
          ...bundle.bundle,
          next: bundle._links.next,
          swapUrl: swapRecommendation && swapRecommendation.href,
          itemIds: bundle._embedded['b:tiles'].map(item => getItemId(item)),
          mustReadItemIds: bundle._embedded['b:tiles']
            .filter(item => item.must_read)
            .map(item => getItemId(item)),
          swapCandidateItemId: null,
          candidateTiles: bundle._links['b:candidate-tiles'],
          itemsSwapped: 0,
          swapStatus: STATUS_INITIAL,
          swappingItemId: null,
        },
      ],
      status: STATUS_OK,
    });
  }

  onFetchBundleError({ error }) {
    this.setState({
      status: STATUS_ERROR,
    });
  }

  onFetchNextBundle() {
    this.setState({ status: STATUS_PENDING });
  }

  onFetchNextBundleError() {
    // Remove loading state, don't show an error view.
    this.setState({ status: STATUS_OK });
  }

  onFetchTileSwapCandidateSuccess({ tile, bundleUid }) {
    const bundles = this.state.bundles.map((bundle) => {
      if (bundle.uid !== bundleUid) {
        return bundle;
      }

      const manifest = tile._embedded['b:manifest'];
      return {
        ...bundle,
        swapCandidateItemId: manifest.id,
      };
    });

    this.setState({
      bundles,
    });
  }

  onSwapItem({ bundleUid, itemId }) {
    const bundles = this.state.bundles.map((bundle) => {
      if (bundle.uid !== bundleUid) {
        return bundle;
      }

      return {
        ...bundle,
        swapStatus: STATUS_PENDING,
        error: null,
        swappingItemId: itemId, // The itemId of the item in progress of being swapped
      };
    });

    this.setState({
      bundles,
    });
  }

  onSwapItemSuccess({ bundleUid, itemId, swappedItemId }) {
    const bundles = this.state.bundles.map((bundle) => {
      if (bundle.uid !== bundleUid) {
        return bundle;
      }

      if (!swappedItemId) {
        return bundle;
      }

      return {
        ...bundle,
        swapStatus: STATUS_OK,
        itemIds: bundle.itemIds.map((bundleItemId) => {
          if (bundleItemId === itemId) {
            return swappedItemId;
          }

          return bundleItemId;
        }),
        swapCandidateItemId: null,
        error: null,
        itemsSwapped: bundle.itemsSwapped + 1,
      };
    });

    this.setState({
      bundles,
    });
  }

  onSwapItemError({ error, bundleUid }) {
    const bundles = this.state.bundles.map((bundle) => {
      if (bundle.uid !== bundleUid) {
        return bundle;
      }

      return {
        ...bundle,
        swapStatus: STATUS_ERROR,
        error,
      };
    });

    this.setState({
      bundles,
    });
  }
}

export default alt.createStore(BundlesStore, 'BundlesStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/BundlesStore.js