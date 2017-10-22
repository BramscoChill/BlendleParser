import { STATUS_OK, STATUS_ERROR } from 'app-constants';
import { getItem } from 'selectors/sessionState';
import altConnect from 'higher-order-components/altConnect';
import SessionStore from 'stores/SessionStore';
import StoriesStore from '../stores/StoriesStore';
import SectionEmptyState from '../components/SectionEmptyState';

const isDoneLoading = status => [STATUS_OK, STATUS_ERROR].includes(status);

function mapStateToProps({ sessionState, storiesState }, { numberOfPlaceholders }) {
  const { storiesOrder } = storiesState;
  const didSetPreferences = !!getItem(sessionState, 'didUpdatePreferences');
  // Prevent re-rending the loading state after updating the preferences
  const isLoading = !isDoneLoading(storiesState.storiesStatus) && !didSetPreferences;

  return {
    didSetPreferences,
    numberOfPlaceholders,
    isLoading,
    storiesCount: storiesOrder.length,
  };
}

mapStateToProps.stores = { SessionStore, StoriesStore };

export default altConnect(mapStateToProps)(SectionEmptyState);



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/containers/EmptyStateContainer.js