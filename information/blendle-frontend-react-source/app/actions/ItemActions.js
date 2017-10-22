/* eslint-disable class-methods-use-this */

import alt from 'instances/altInstance';
import { get } from 'lodash';
import { XHR_STATUS } from 'app-constants';
import * as ItemManager from 'managers/item';
import ItemModel from 'models/item';
import PinsManager from 'managers/pins';
import Analytics from 'instances/analytics';
import AuthActions from 'actions/AuthActions';
import { getItemId } from 'selectors/item';
import TileActions from 'actions/TileActions';
import { allowImages } from 'helpers/itemImages';

function removeImageIfNeeded(content, itemDate, itemId, providerId) {
  const embeddedContent = content._embedded.content;

  if (!allowImages(itemDate, itemId, providerId)) {
    embeddedContent.images = [];
    const mediaSets = get(embeddedContent, ['_embedded', 'b:media-sets']);

    if (mediaSets) {
      embeddedContent._embedded['b:media-sets'] = mediaSets.filter(
        mediaSet => mediaSet.type !== 'image',
      );
    }

    const subItems = get(embeddedContent, ['_embedded', 'items']);
    if (subItems) {
      embeddedContent._embedded.items = subItems.map(item => ({
        ...item,
        images: [],
      }));
    }
  }

  return content;
}

class ItemActions {
  fetchItemSuccess = x => x;
  fetchItemError = x => x;

  /**
   * fetch an item from the webservice
   * @param {String} itemId
   */
  fetchItem(itemId) {
    const item = new ItemModel({ id: itemId });

    item
      .fetch()
      .then(() => {
        this.fetchItemSuccess({ item });
      })
      .catch((error) => {
        if (error.type === XHR_STATUS) {
          return this.fetchItemError({ item, error });
        }
        throw error;
      });

    return { item };
  }

  /**
   * pin an item
   * @param {Object} user
   * @param {Object} item
   * @param {Boolean} pinned
   * @param {Object} analyticsOptions
   */
  pinItem(user, item, pinned, analyticsOptions) {
    PinsManager.updatePin(user, getItemId(item), pinned).then(() => AuthActions.update(user)); // put changed user in the store

    const event = pinned ? 'Pin Item' : 'Unpin Item';

    Analytics.trackItemEvent(item, analyticsOptions, event);

    return {
      itemId: getItemId(item),
      pinned,
    };
  }

  openItem(returnUrl) {
    return {
      returnUrl,
      perfStartTime: Date.now(),
    };
  }

  fetchContent(itemId, userId) {
    ItemManager.fetchContent(itemId)
      .then(content => this.fetchContentSuccess({ userId, content, itemId }))
      .catch((error) => {
        this.fetchContentError({ userId, error, itemId });
        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return { itemId };
  }

  acquireItem(itemId, userId, socialOrigin) {
    ItemManager.acquireItem(userId, itemId, socialOrigin)
      .then((acquisition) => {
        this.acquireItemSuccess({ itemId, justAcquired: true, acquisition });
      })
      .catch((error) => {
        this.acquireItemError({ userId, error, itemId });
        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return { itemId, userId, socialOrigin };
  }

  acquireItemSuccess = values => values;

  acquireItemError({ userId, error, itemId }) {
    TileActions.fetchTile(userId, itemId); // Refresh (or fetch) tile
    return { error, itemId };
  }

  storeReadingProgress(paragraphsReadQuotient, { userId, itemId }) {
    ItemManager.storeReadingProgress(paragraphsReadQuotient, { userId, itemId });
    return paragraphsReadQuotient;
  }

  clearReadingProgress({ userId, itemId }) {
    ItemManager.clearReadingProgress({ userId, itemId });
    return null; // Reset the synced reading state
  }

  fetchReadingProgress = ({ itemId, userId }) => (dispatch) => {
    ItemManager.fetchReadingProgress({ itemId, userId }).then(dispatch);
  };

  fetchContentSuccess({ userId, content, itemId }) {
    AuthActions.fetchUser(); // Refresh balance and reads
    TileActions.fetchTile(userId, itemId); // Refresh (or fetch) tile

    const entities = content._links['s:about'];
    const itemDate = content._embedded.content.date;
    const providerId = content._embedded.content.provider.id;
    const parsedContent = removeImageIfNeeded(content, itemDate, itemId, providerId);

    return { content: parsedContent, itemId, entities };
  }

  fetchContentError({ userId, error, itemId }) {
    TileActions.fetchTile(userId, itemId); // Refresh (or fetch) tile
    return { error, itemId };
  }

  paragraphsMeasured = topPositions => topPositions;

  consumeErrors = () => true;
  closeItem = () => true;
  setAutoRefundable = autoRefundable => autoRefundable;

  print({ item_id, provider_id }) {
    window.print();
    Analytics.track('Print Item', { item_id, provider_id });

    return true;
  }

  showImageZoom = x => x;
  hideImageZoom = () => true;

  afterPrint = () => true;
  afterCopiedAll = () => true;
  afterCopy = () => true;

  scrollItem = x => x;
}

export default alt.createActions(ItemActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ItemActions.js