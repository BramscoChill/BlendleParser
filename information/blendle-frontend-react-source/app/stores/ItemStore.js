import {
  STATUS_INITIAL,
  STATUS_PENDING,
  STATUS_OK,
  STATUS_ERROR,
  AUTO_REFUND_TIMEOUT,
} from 'app-constants';
import alt from 'instances/altInstance';
import ItemActions from '../actions/ItemActions';

const getInitialState = () => ({
  acquisition: null,
  acquisitionError: null,
  acquiredWithSharer: undefined,
  runningAcquisitionXHRs: 0,
  status: STATUS_INITIAL,
  justAcquired: false,
  autoRefundable: false,
  item: null,
  error: null,
  selectedItemId: null,
  hasPrinted: false,
  hasSelectAll: false,
  activeImage: null,
  hasCopied: false,
  content: {
    data: null,
    status: STATUS_INITIAL,
    error: null,
  },
  entities: [],
  paragraphPositions: [],
  currentParagraphQuotient: undefined,
  storedParagraphQuotient: undefined,
  fetchedParagraphQuotient: undefined,
  readingPercentage: 0,
  maxReadingPercentage: 0,
  scrollPixelsFromTop: 0,
  perfStartTime: 0,
  returnUrl: '/',
});

// TODO: remove item for deeplink use tile
class ItemStore {
  constructor() {
    this.bindActions(ItemActions);

    this.state = getInitialState();
  }

  onFetchItem({ item }) {
    this.setState({
      item,
      status: STATUS_PENDING,
    });
  }

  onFetchItemSuccess({ item }) {
    this.setState({
      item,
      status: STATUS_OK,
    });
  }

  onFetchItemError({ item, error }) {
    this.setState({
      item,
      error,
      status: STATUS_ERROR,
    });
  }

  onFetchContent({ itemId }) {
    this.setState({
      error: null,
      selectedItemId: itemId,
      content: {
        data: null,
        status: STATUS_PENDING,
        error: null,
      },
    });
  }

  onFetchContentSuccess({ itemId, content, entities }) {
    if (this.state.selectedItemId !== itemId) {
      return;
    }

    this.setState({
      content: {
        data: content._embedded.content,
        status: STATUS_OK,
        error: null,
      },
      entities: Array.isArray(entities) ? entities : [],
    });
  }

  onAcquireItem({ socialOrigin: acquiredWithSharer }) {
    const runningAcquisitionXHRs = this.state.runningAcquisitionXHRs + 1;

    this.setState({
      acquisitionError: null,
      error: null,
      runningAcquisitionXHRs,
      acquiredWithSharer,
    });
  }

  onAcquireItemSuccess({ itemId, justAcquired, acquisition }) {
    if (this.state.selectedItemId !== itemId) {
      return;
    }

    if (this._autoRefundTimer) {
      window.clearTimeout(this._autoRefundTimer);
    }

    if (justAcquired) {
      this._autoRefundTimer = window.setTimeout(() => {
        this.setState({ autoRefundable: false });
      }, AUTO_REFUND_TIMEOUT);
    }

    const runningAcquisitionXHRs = this.state.runningAcquisitionXHRs - 1;

    this.setState({
      autoRefundable: justAcquired && acquisition.refundable,
      justAcquired,
      acquisition,
      acquisitionError: null,
      runningAcquisitionXHRs,
    });
  }

  onAcquireItemError({ itemId, error }) {
    if (this.state.selectedItemId !== itemId) {
      return;
    }

    const runningAcquisitionXHRs = this.state.runningAcquisitionXHRs - 1;

    this.setState({
      status: STATUS_ERROR,
      acquisitionError: error,
      runningAcquisitionXHRs,
    });
  }

  onFetchContentError({ itemId, error }) {
    if (this.state.selectedItemId !== itemId) {
      return;
    }

    this.setState({
      status: STATUS_ERROR,
      error,
    });
  }

  onOpenItem({ returnUrl, perfStartTime }) {
    if (this.state.returnUrl === '/') {
      // Only set returnUrl there is no other route specifyed
      this.setState({ returnUrl });
    }

    this.setState({ perfStartTime });
  }

  onConsumeErrors() {
    this.setState({ error: null, acquisitionError: null });
  }

  onCloseItem() {
    this.setState(getInitialState());
  }

  onSetAutoRefundable(autoRefundable) {
    this.setState({ autoRefundable });
  }

  onAfterPrint(hasPrinted) {
    this.setState({ hasPrinted });
  }

  onAfterCopy(hasCopied) {
    this.setState({ hasCopied });
  }

  onAfterCopiedAll(hasCopiedAll) {
    this.setState({ hasCopiedAll });
  }

  onParagraphsMeasured(paragraphPositions) {
    this.setState({ paragraphPositions });
  }

  onScrollItem({ readingPercentage, scrollPixelsFromTop, currentParagraphQuotient }) {
    this.setState({
      scrollPixelsFromTop,
      readingPercentage,
      maxReadingPercentage: Math.max(readingPercentage, this.state.maxReadingPercentage),
      currentParagraphQuotient,
    });
  }

  onStoreReadingProgress(storedParagraphQuotient) {
    this.setState({
      storedParagraphQuotient,
    });
  }

  onClearReadingProgress() {
    this.setState({
      storedParagraphQuotient: undefined,
    });
  }

  onFetchReadingProgress(fetchedParagraphQuotient) {
    this.setState({
      fetchedParagraphQuotient,
    });
  }

  onShowImageZoom({ originalImage, caption, credit, originPosition }) {
    this.setState({
      activeImage: {
        ...originalImage,
        caption,
        credit,
        originPosition,
      },
    });
  }

  onHideImageZoom() {
    this.setState({
      activeImage: null,
    });
  }
}

export default alt.createStore(ItemStore, 'ItemStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/ItemStore.js