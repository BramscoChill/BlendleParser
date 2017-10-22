import alt from 'instances/altInstance';
import { translate } from 'instances/i18n';
import TimelineManager from 'managers/timeline';
import { XHR_STATUS, ARTICLE_SWAP_ERROR_TYPES } from 'app-constants';
import { get } from 'lodash';
import { validTiles } from 'selectors/tiles';
import NotificationActions from 'actions/NotificationsActions';
import ItemPreferenceActions from 'actions/ItemPreferenceActions';
import Analytics from 'instances/analytics';
import URI from 'urijs';
import axios from 'axios';

let fetchBundleTimeout = null;

function parseBundleResponse(bundle) {
  return {
    ...bundle,
    _embedded: {
      'b:tiles': validTiles(bundle._embedded['b:tiles']),
    },
  };
}

class BundlesActions {
  fetchBundleError = x => x;
  fetchTileSwapCandidateSuccess = x => x;
  fetchTileSwapCandidateError = x => x;

  fetchBundleSuccess({ bundle }) {
    const candidateTiles = get(bundle, '_links[b:candidate-tiles]', []);
    if (candidateTiles.length) {
      // Preload the first swap candidate for a smooth transition
      this.fetchTileSwapCandidate(bundle.bundle.uid, candidateTiles[0].href);
    }

    return { bundle };
  }

  fetchBundle(userId, retryCount = 0) {
    if (retryCount === 0) {
      clearTimeout(fetchBundleTimeout);
    }

    TimelineManager.fetchBundle(userId)
      .then(parseBundleResponse)
      .then(bundle => this.fetchBundleSuccess({ bundle }))
      .catch((err) => {
        if (err.status === 404 && retryCount < 10) {
          // Retry, bundle could not be ready yet
          fetchBundleTimeout = setTimeout(() => {
            this.fetchBundle(userId, retryCount + 1);
          }, (retryCount + 1) * 500);
          return;
        }

        if (err.type === XHR_STATUS) {
          this.fetchBundleError({
            err,
          });
          return;
        }

        throw err;
      });

    return null;
  }

  fetchNextBundle(prevBundle) {
    return (dispatch) => {
      const next = prevBundle.next;
      if (!next) {
        return;
      }

      dispatch(prevBundle);

      axios
        .get(next.href, {
          headers: {
            accept: 'application/hal+json',
            'X-Tile-Version': 3,
          },
        })
        .then(resp => resp.data)
        .then(bundle => this.fetchBundleSuccess({ bundle }))
        .catch((err) => {
          this.fetchNextBundleError();

          if (err.type !== XHR_STATUS) {
            throw err;
          }
        });
    };
  }

  fetchNextBundleError() {
    return null;
  }

  /**
   * Preload a tile swap for bundle with given id
   * @param bundleUid - the ID of the bundle to load a tile swap for
   * @param url the URL of the tile
   */
  fetchTileSwapCandidate(bundleUid, url) {
    axios
      .get(url, {
        headers: {
          accept: 'application/hal+json',
          'X-Tile-Version': 3,
        },
      })
      .then(response => response.data)
      .then(tile => this.fetchTileSwapCandidateSuccess({ tile, bundleUid }))
      .catch((err) => {
        this.fetchTileSwapCandidateError({ error: err, bundleUid });

        if (err.type !== XHR_STATUS) {
          throw err;
        }
      });

    return null;
  }

  swapItem(bundle, userId, itemId, notification, analytics) {
    return (dispatch) => {
      dispatch({ bundleUid: bundle.uid, itemId });

      const { swapUrl, swapCandidateItemId } = bundle;
      if (!swapUrl || !swapCandidateItemId) {
        // Old bundles can't swap, or there's no candidates left
        const error = !swapCandidateItemId
          ? ARTICLE_SWAP_ERROR_TYPES.NO_SWAP_CANDIDATES
          : ARTICLE_SWAP_ERROR_TYPES.BUNDLE_TOO_OLD;

        this.swapItemError({
          itemId,
          bundleUid: bundle.uid,
          notification,
          error: {
            id: error,
          },
        });

        return;
      }

      const requestUrl = URI.expand(swapUrl, {
        item_id: itemId,
      }).toString();

      axios
        .post(requestUrl)
        .then(resp => resp.data)
        .then(
          resp =>
            new Promise((resolve, reject) => {
              const swappedItemId = resp.new_recommendation.item_uid;
              // Resolve if the preloaded candidate matches the new recommendation
              if (swappedItemId === swapCandidateItemId) {
                resolve(swappedItemId);
                return;
              }

              // If the preloaded tile does not match the swap recommendation, fetch it manually
              TimelineManager.fetchSingleTile(swappedItemId)
                .then(tile =>
                  this.fetchTileSwapCandidateSuccess({
                    bundleUid: bundle.uid,
                    tile,
                  }),
                )
                .then(() => resolve(swappedItemId))
                .catch(reject);
            }),
        )
        .then(swappedItemId =>
          this.swapItemSuccess({
            bundleUid: bundle.uid,
            itemId,
            swappedItemId,
            notification,
            analytics,
          }),
        )
        .then(() => {
          // Preload the tile for the next swap
          const itemsSwapped = bundle.itemsSwapped;
          const nextCandidate = bundle.candidateTiles[itemsSwapped + 1];
          if (nextCandidate) {
            this.fetchTileSwapCandidate(bundle.uid, nextCandidate.href);
          }
        })
        .catch((err) => {
          const error = get(err, 'data[_errors][0]', null);

          this.swapItemError({
            bundleUid: bundle.uid,
            itemId,
            notification,
            error,
          });

          if (err.type !== XHR_STATUS) {
            throw err;
          }
        });
    };
  }

  swapItemSuccess(successObject) {
    const { notification, itemId, swappedItemId, analytics } = successObject;

    Analytics.track('Article Swapped', {
      ...analytics,
      item_id: itemId,
      swap_item_id: swappedItemId,
    });

    const notificationProps = {
      title: translate('preferences.notifications.swap_success.title'),
      message: translate('preferences.notifications.swap_success.description'),
    };
    NotificationActions.showNotification(notification, notificationProps, `${itemId}-swap-success`);

    return successObject;
  }

  swapItemError(errorObject) {
    const { notification, error, itemId } = errorObject;

    if (notification) {
      const notificationProps = {
        title: translate('preferences.notifications.swap_limit.title'),
        message:
          error.id === ARTICLE_SWAP_ERROR_TYPES.SWAP_LIMIT_REACHED
            ? translate('preferences.notifications.swap_limit.description')
            : translate('preferences.notifications.swap_no_artiicle.description'),
      };
      NotificationActions.showNotification(notification, notificationProps, `${itemId}-swap-error`);
    }

    return errorObject;
  }
}

export default alt.createActions(BundlesActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/BundlesActions.js