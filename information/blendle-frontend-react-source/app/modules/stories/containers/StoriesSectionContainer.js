import { compose, lifecycle } from 'recompose';
import altConnect from 'higher-order-components/altConnect';
import hideOn from 'higher-order-components/hideOn';
import { STATUS_ERROR } from 'app-constants';
import AuthStore from 'stores/AuthStore';
import StoriesStore from '../stores/StoriesStore';
import SeenItemsActions from '../actions/SeenItemsActions';
import SeenItemsStore from '../stores/SeenItemsStore';
import StoriesActions from '../actions/StoriesActions';
import StoriesSection from '../components/StoriesSection';

function mapStateToProps({ storiesState, seenItemsState }, { detailsRoute }) {
  const { stories, storiesStatus, originalStoriesOrder, storiesOrder } = storiesState;

  return {
    isHidden: storiesStatus === STATUS_ERROR,
    stories: originalStoriesOrder.map(storyId => stories.get(storyId)),
    storiesOrder,
    seenItems: seenItemsState.seenItems,
    detailsRoute,
  };
}

mapStateToProps.stores = { StoriesStore, SeenItemsStore };

const actions = {
  setTransitionOrigin: StoriesActions.setTransitionOrigin,
};

const enhance = compose(
  lifecycle({
    componentDidMount() {
      window.requestIdleCallback(
        () => {
          const userId = AuthStore.getState().user.id;

          SeenItemsActions.fillStoreWithSeenItemIds();

          const { seenItems } = SeenItemsStore.getState();
          StoriesActions.fetchOverview(userId, seenItems);
        },
        { timeout: 1000 },
      );
    },
  }),
  altConnect(mapStateToProps, actions),
);

export default enhance(StoriesSection);



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/containers/StoriesSectionContainer.js