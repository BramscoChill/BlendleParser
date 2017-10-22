import alt from 'instances/altInstance';
import TimelineManager from 'managers/timeline';
import { XHR_STATUS, STATUS_PENDING } from 'app-constants';
import AuthController from 'controllers/auth';
import { validTiles } from 'selectors/tiles';

/**
 * call the correct manager for the given timeline
 * @param {String} name
 * @param {String} userId
 * @param {Object} [options]
 * @returns {Promise}
 */
function fetchTimeline(name, userId, options) {
  switch (name) {
    case 'following':
      return TimelineManager.fetchFollowing(userId);
    case 'pins':
      return TimelineManager.fetchPins(userId);
    case 'trending':
      AuthController.getUser().updateLastViewedTrendingTime();
      return TimelineManager.fetchTrending(userId, options.details);
    case 'channel':
      return TimelineManager.fetchChannel(userId, options.details);
    case 'user':
      return TimelineManager.fetchUser(options.details);
    case 'userArchive':
      return TimelineManager.fetchUserArchive(userId, options.details);
    case '_feed':
      return TimelineManager.fetchTilesByUrl(options.url);
    default:
      throw new Error(`undefined timeline ${name}`);
  }
}

class TimelineActions {
  constructor() {
    this.generateActions(
      'fetchTimelineSuccess',
      'fetchTimelineError',
      'fetchNextItemsSuccess',
      'fetchNextItemsError',
    );
  }

  /**
   * @param {String} name
   * @param {String} userId
   * @param {Object} [options={}]
   */
  fetchTimeline(name, userId, options = {}) {
    // if no trending filter is given, we get the latest for the user
    if (name === 'trending' && !options.details) {
      options.details = TimelineManager.getUserTrendingFilter(AuthController.getUser());
    }

    fetchTimeline(name, userId, options)
      .then(({ tiles, next }) => {
        this.fetchTimelineSuccess({
          name,
          options,
          items: validTiles(tiles),
          next,
        });
      })
      .catch((err) => {
        if (err.type === XHR_STATUS && err.status === 404) {
          return this.fetchTimelineSuccess({ name, items: [], options });
        }
        if (err.type === XHR_STATUS) {
          return this.fetchTimelineError({ name, err, options });
        }
        throw err;
      });

    return { name, options };
  }

  /**
   * This method now mutates the original collection and adds the next items to it.
   * Eventually we don't want this, but we're now in a hybrid environment (Backbone-React)
   * @param {String} name
   * @param {Collection} collection
   * @param {Object} [options={}]
   */
  fetchNextItems(timeline) {
    // TODO remove exception when backend implements new tile endpoint for userarchive
    if (timeline.name === 'userArchive') {
      TimelineManager.fetchNextUserArchive(timeline.next)
        .then(({ tiles, next }) => {
          this.fetchNextItemsSuccess({
            name: timeline.name,
            options: timeline.options,
            items: validTiles(tiles),
            next,
          });
        })
        .catch((err) => {
          if (err.type === STATUS_PENDING) {
            return;
          }
          if (err.type === XHR_STATUS) {
            this.fetchNextItemsError({ name: timeline.name, err, options: timeline.options });
            return;
          }
          throw err;
        });
    } else {
      TimelineManager.fetchTilesByUrl(timeline.next)
        .then(({ tiles, next }) => {
          this.fetchNextItemsSuccess({
            name: timeline.name,
            options: timeline.options,
            items: validTiles(tiles),
            next,
          });
        })
        .catch((err) => {
          if (err.type === STATUS_PENDING) {
            return;
          }
          if (err.type === XHR_STATUS) {
            this.fetchNextItemsError({ name: timeline.name, err, options: timeline.options });
            return;
          }
          throw err;
        });
    }

    return { name: timeline.name, options: timeline.options };
  }
}

export default alt.createActions(TimelineActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/TimelineActions.js