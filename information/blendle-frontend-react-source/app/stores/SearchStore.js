import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import SearchActions from 'actions/SearchActions';
import { uniq } from 'lodash';
import { getItemId } from 'selectors/item';

class SearchStore {
  constructor() {
    this.bindActions(SearchActions);

    this.state = {
      status: STATUS_INITIAL,
      query: {},
      itemIds: [],
      issues: [],
      next: null,
      error: null,
      active: false,
    };
  }

  onFetchResults({ query }) {
    this.setState({
      query,
      status: STATUS_PENDING,
      itemIds: [],
      issues: [],
    });
  }

  onFetchResultsSuccess({ query, items, issues }) {
    this.setState({
      status: STATUS_OK,
      error: null,
      query,
      itemIds: items.tiles.map(item => getItemId(item)),
      next: items.next,
      issues,
    });

    this.preventDefault(); // TilesStore will emit the change
  }

  onFetchResultsError({ query, error }) {
    this.setState({
      status: STATUS_ERROR,
      query,
      error,
    });
  }

  onFetchNextResults() {
    this.setState({ status: STATUS_PENDING });
  }

  onFetchNextResultsSuccess({ items }) {
    this.setState({
      status: STATUS_OK,
      itemIds: uniq([...this.state.itemIds, ...items.tiles.map(item => getItemId(item))]),
      next: items.next,
    });

    this.preventDefault(); // TilesStore will emit the change
  }

  onFetchNextResultsError({ error }) {
    this.setState({
      status: STATUS_ERROR,
      error,
    });
  }

  onSetActive() {
    this.setState({ active: true });
  }

  onSetInactive() {
    this.setState({ active: false });
  }
}

export default alt.createStore(SearchStore, 'SearchStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/SearchStore.js