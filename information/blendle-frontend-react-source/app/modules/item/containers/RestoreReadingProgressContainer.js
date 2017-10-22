import React from 'react';
import { onlyUpdateForKeys } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import ItemStore from 'stores/ItemStore';
import NotificationsActions from 'actions/NotificationsActions';
import Analytics from 'instances/analytics';
import AuthStore from 'stores/AuthStore';
import ItemActions from 'actions/ItemActions';
import Scroll from 'helpers/scroll';
import RestoreReadingProgressNotification from '../components/RestoreReadingProgressNotification';

const getParagraphReadIndex = (quotient, paragraphsCount) => Math.round(quotient * paragraphsCount);

const scrollToParagraph = () => {
  const {
    fetchedParagraphQuotient,
    paragraphPositions,
    selectedItemId: itemId,
  } = ItemStore.getState();

  const paragraphIndex = getParagraphReadIndex(fetchedParagraphQuotient, paragraphPositions.length);
  const paragraphTop = paragraphPositions[paragraphIndex];

  window.requestAnimationFrame(() => {
    Scroll.vertical(document.body, paragraphTop - 30); // Works on webkit
    Scroll.vertical(window, paragraphTop - 30); // Works on Firefox
  });
  NotificationsActions.hideNotification(`restore-paragraph-${itemId}`);

  Analytics.track('Reading Position Resumed', {
    item_id: itemId,
  });
};

const dismissRestore = () => {
  const { selectedItemId: itemId } = ItemStore.getState();
  const { user: { id: userId } } = AuthStore.getState();
  NotificationsActions.hideNotification(`restore-paragraph-${itemId}`);
  ItemActions.clearReadingProgress({ itemId, userId });

  Analytics.track('Resume Reading Position Question Dismissed', {
    item_id: itemId,
  });
};

const mapStateToProps = ({ itemState }) => ({
  paragraphsReadIndex: getParagraphReadIndex(
    itemState.fetchedParagraphQuotient,
    itemState.paragraphPositions.length,
  ),
  itemId: itemState.selectedItemId,
});
mapStateToProps.stores = { ItemStore };

const MaybeRestoreReadingProgress = onlyUpdateForKeys([
  'paragraphsReadIndex',
  'itemId',
])(({ paragraphsReadIndex, itemId }) => {
  if (paragraphsReadIndex >= 3) {
    Analytics.track('Resume Reading Position Question Shown', {
      item_id: itemId,
    });

    NotificationsActions.showNotification.defer(
      RestoreReadingProgressNotification,
      { scrollToParagraph, dismissRestore },
      `restore-paragraph-${itemId}`,
      { delay: 250, duration: 60000 },
    );
  }

  return null;
});

export default altConnect(mapStateToProps)(MaybeRestoreReadingProgress);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/RestoreReadingProgressContainer.js