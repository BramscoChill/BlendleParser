import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ItemStore from 'stores/ItemStore';
import AuthStore from 'stores/AuthStore';
import ItemActions from 'actions/ItemActions';

function syncReadingProgressIfNeeded() {
  const {
    selectedItemId: itemId,
    currentParagraphQuotient,
    storedParagraphQuotient,
    paragraphPositions: { length: totalParagraphCount },
    readingPercentage,
  } = ItemStore.getState();

  const paragraphsRead = Math.round(currentParagraphQuotient * totalParagraphCount);
  const { user: { id: userId } } = AuthStore.getState();

  const shouldClearSyncedData =
    storedParagraphQuotient !== undefined &&
    (currentParagraphQuotient === 1 || // Sure? This data can be handy
      paragraphsRead < 3 ||
      readingPercentage >= 100);

  if (shouldClearSyncedData) {
    ItemActions.clearReadingProgress({
      itemId,
      userId,
    });
    return;
  }

  const shouldStoreData =
    paragraphsRead > 3 &&
    storedParagraphQuotient !== currentParagraphQuotient &&
    currentParagraphQuotient < 1 && // Maybe later, handy data
    readingPercentage < 100;

  if (shouldStoreData) {
    ItemActions.storeReadingProgress(currentParagraphQuotient, {
      itemId,
      userId,
    });
  }
}

export default ComposedComponent =>
  class syncReaderProgress extends PureComponent {
    static propTypes = {
      params: PropTypes.object.isRequired,
    };

    _syncReadingInterval = null;

    componentDidMount() {
      const { itemId } = this.props.params;
      const { user: { id: userId } } = AuthStore.getState();

      ItemActions.fetchReadingProgress.defer({ itemId, userId });
      this._syncReadingInterval = setInterval(syncReadingProgressIfNeeded, 5000);
    }

    componentWillUnmount() {
      clearInterval(this._syncReadingInterval);
      syncReadingProgressIfNeeded();
    }

    componentWillReceiveProps(nextProps) {
      const { itemId } = nextProps.params;
      if (this.props.params.itemId !== itemId) {
        syncReadingProgressIfNeeded();
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/syncReaderProgress.js