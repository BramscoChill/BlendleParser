import alt from 'instances/altInstance';
import { without, difference, intersection } from 'lodash';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import StoriesActions from '../actions/StoriesActions';

/**
 * Finds the itemId in the given array and reinserts it to the end of the array
 * Returns a new array
 * @param {Array<string>} array Array to re-order
 * @param {string} itemId id of the item to reinsert
 */
export function reinsertToEnd(array, itemId) {
  const filteredArray = without(array, itemId);
  return [...filteredArray, itemId];
}

class StoriesStore {
  state = {
    storiesStatus: STATUS_INITIAL,
    stories: new Map(),
    originalStoriesOrder: [],
    storiesOrder: [],
    storyDetails: new Map(),
    activeStoryId: null,
    activeIndexInStory: 0,
    transitionOrigin: null,
  };

  constructor() {
    this.bindActions(StoriesActions);
  }

  onFetchOverview() {
    this.setState({
      storiesStatus: STATUS_PENDING,
    });
  }

  onFetchOverviewSuccess(overview) {
    const order = overview.map(story => story.id);

    const stories = new Map();
    overview.forEach((story) => {
      stories.set(story.id, story);
    });

    const currentStoriesOrder = this.state.storiesOrder;

    // If an order is already stored, retain that order but move newly added stories to the front.
    const storiesOrder = currentStoriesOrder.length
      ? [...difference(order, currentStoriesOrder), ...intersection(currentStoriesOrder, order)]
      : order;

    this.setState({
      stories,
      originalStoriesOrder: order,
      storiesOrder,
      storiesStatus: STATUS_OK,
    });
  }

  onFetchOverviewError(error) {
    this.setState({
      storiesStatus: STATUS_ERROR,
      error,
    });
  }

  onFetchStoryTiles(storyId) {
    const storyDetails = new Map(...this.state.storyDetails);

    storyDetails.set(storyId, {
      status: STATUS_PENDING,
    });

    this.setState({ storyDetails });
  }

  onFetchStoryTilesSuccess({ storyId, tileIds }) {
    const storyDetails = new Map(...this.state.storyDetails);

    storyDetails.set(storyId, {
      id: storyId,
      status: STATUS_OK,
      tileIds,
      activeIndex: 0,
    });

    this.setState({ storyDetails });
  }

  onFetchStoryTilesError({ storyId, error }) {
    // TODO: implement proper error handling

    const storyDetails = new Map(...this.state.storyDetails);

    storyDetails.set(storyId, {
      status: STATUS_ERROR,
      error,
    });

    this.setState({ storyDetails });
  }

  onSetActiveStoryId(activeStoryId) {
    this.setState({
      activeStoryId,
    });
  }

  onCloseStory({ storyId, isCompleted }) {
    const storyDetails = new Map(...this.state.storyDetails);

    storyDetails.set(storyId, {
      ...storyDetails.get(storyId),
      activeIndex: 0, // Always reset the state of the story index
    });

    this.setState({
      storyDetails,
      storiesOrder: isCompleted
        ? reinsertToEnd(this.state.storiesOrder, storyId)
        : this.state.storiesOrder,
      activeStoryId: null,
    });
  }

  onSetIndexInStory({ storyId, nextIndex }) {
    const storyDetails = new Map(...this.state.storyDetails);

    storyDetails.set(storyId, {
      ...storyDetails.get(storyId),
      activeIndex: nextIndex,
    });

    this.setState({
      storyDetails,
    });
  }

  onSetTransitionOrigin({ xPos, yPos }) {
    const transitionOrigin = { xPos, yPos };

    this.setState({ transitionOrigin });
  }

  onClearTransitionOrigin() {
    this.setState({ transitionOrigin: null });
  }
}

export default alt.createStore(StoriesStore, 'StoriesStore');



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/stores/StoriesStore.js