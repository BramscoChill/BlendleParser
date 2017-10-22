/* eslint-disable class-methods-use-this */
import alt from 'instances/altInstance';
import moment from 'moment';
import { XHR_STATUS } from 'app-constants';
import { getItem, setItem } from 'helpers/localStorage';
import { flatten } from 'lodash';
import { fetchTilesByUrl } from 'managers/timeline';
import { getItemId } from 'selectors/item';
import { unreadCount } from '../selectors/stories';
import SeenItemsStore from '../stores/SeenItemsStore';
import { TUTORIAL_OVERLAY_VISIBLE_KEY, TUTORIAL_COMPLETED_DAY_KEY } from '../constants';
import tutorialStory from '../data/tutorialStory.json';
import * as storiesManager from '../managers/storiesManager';

/**
 * Sort the stories overview so the unseenStories are placed at the beginning of the array
 * @param {Array<object>} stories Array of stories
 * @param {Map<string, bool>} seenItems Map containing seen item Ids
 */
function sortStoryOverview(stories, seenItems) {
  return flatten(
    stories.reduce(
      (result, tile) => {
        const [unseenStories, seenStories] = result;

        if (unreadCount(tile, seenItems) === 0) {
          seenStories.push(tile);
        } else {
          unseenStories.push(tile);
        }

        return [unseenStories, seenStories];
      },
      [[], []],
    ),
  );
}

/**
 * Add the tutorial story to the array of stories
 */
function addTutorialStoryIfEligible(stories) {
  const today = moment.utc();
  const tutorialCompletedDate = getItem(TUTORIAL_COMPLETED_DAY_KEY);

  if (!tutorialCompletedDate || moment(tutorialCompletedDate).isSame(today, 'day')) {
    stories.unshift(tutorialStory);
  }

  return stories;
}

class StoriesActions {
  fetchOverview(userId, seenItems) {
    storiesManager
      .fetchOverview(userId)
      .then(resp => resp._embedded['b:stories'])
      .then(addTutorialStoryIfEligible)
      .then(stories => sortStoryOverview(stories, seenItems))
      .then(this.fetchOverviewSuccess)
      .catch((error) => {
        this.fetchOverviewError(error);

        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return null;
  }

  fetchOverviewSuccess = overview => overview;
  fetchOverviewError = error => error;

  fetchStoryTiles(userId, storyId, url) {
    fetchTilesByUrl(url)
      .then(({ tiles }) => {
        const tileIds = tiles.map(getItemId);
        this.fetchStoryTilesSuccess({ storyId, tiles, tileIds });
      })
      .catch((error) => {
        this.fetchStoryTilesError({ storyId, error });

        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return storyId;
  }

  closeStory(storyTile) {
    const { seenItems } = SeenItemsStore.getState();

    return {
      storyId: storyTile.id,
      isCompleted: unreadCount(storyTile, seenItems) === 0,
    };
  }

  setTutorialCompletedDate() {
    const completedDateString = moment.utc().toISOString();
    setItem(TUTORIAL_COMPLETED_DAY_KEY, completedDateString);

    return completedDateString;
  }

  fetchStoryTilesSuccess = ({ storyId, tiles, tileIds }) => ({ storyId, tiles, tileIds });
  fetchStoryTilesError = ({ storyId, error }) => ({ storyId, error });

  setActiveStoryId = storyId => storyId;

  setIndexInStory = (storyId, nextIndex) => ({ storyId, nextIndex });

  setTransitionOrigin = transitionOrigin => transitionOrigin;
  clearTransitionOrigin = () => true;
}

export default alt.createActions(StoriesActions);



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/actions/StoriesActions.js