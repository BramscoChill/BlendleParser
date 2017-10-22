import { STATUS_INITIAL, STATUS_OK, STATUS_PENDING, STATUS_ERROR } from 'app-constants';
import alt from 'instances/altInstance';
import AlertsActions from 'actions/AlertsActions';
import { getItemId } from 'selectors/item';
import { uniq } from 'lodash';

class AlertsStore {
  constructor() {
    this.bindActions(AlertsActions);

    this.state = {
      alertsStatus: STATUS_INITIAL,
      resultsStatus: STATUS_INITIAL,
      addAlertStatus: STATUS_INITIAL,
      alerts: [],
      alert: {},
      results: [],
      error: null,
      submittedQuery: null,
      searchQuery: null,
      active: false,
      next: null,
    };
  }

  onSetAlert(alert) {
    this.setState({ alert });
  }

  onFetchAlerts() {
    this.setState({
      alertsStatus: STATUS_PENDING,
      submittedQuery: null,
      results: [],
      resultsStatus: STATUS_INITIAL,
      next: null,
    });
  }

  fetchAlertsError({ error }) {
    this.setState({
      alertsStatus: STATUS_ERROR,
      error,
    });
  }

  onFetchAlertsSuccess(alerts) {
    this.setState({
      alertsStatus: STATUS_OK,
      alerts,
    });
  }

  onFetchResults({ query }) {
    this.setState({
      resultsStatus: STATUS_PENDING,
      submittedQuery: query,
      results: [],
    });
  }

  onFetchNextResults() {
    this.setState({ resultsStatus: STATUS_PENDING });
  }

  onFetchResultsSuccess({ tiles, query, next }) {
    this.setState({
      resultsStatus: STATUS_OK,
      results: tiles.map(item => getItemId(item)),
      next,
    });

    this.preventDefault(); // TilesStore will emit the change
  }

  onFetchNextResultsSuccess({ tiles, query, next }) {
    this.setState({
      resultsStatus: STATUS_OK,
      results: uniq(this.state.results.concat(tiles.map(item => getItemId(item)))),
      next,
    });

    this.preventDefault(); // TilesStore will emit the change
  }

  onSetSearchQuery(searchQuery) {
    this.setState({ searchQuery });
  }

  onAddAlert() {
    this.setState({ addAlertStatus: STATUS_INITIAL });
  }

  onAddAlertSuccess() {
    this.setState({ addAlertStatus: STATUS_OK });
  }

  onAddAlertError({ error }) {
    this.setState({
      addAlertStatus: STATUS_ERROR,
      error,
    });
  }

  onDeleteAlertSuccess({ alertId }) {
    this.setState({
      alert: null,
      alerts: this.state.alerts.filter(alert => alert.id !== alertId),
      results: [],
    });
  }

  onSetInactive() {
    this.setState({ active: false });
  }

  onSetActive() {
    this.setState({ active: true });
  }
}

export default alt.createStore(AlertsStore, 'AlertsStore');



// WEBPACK FOOTER //
// ./src/js/app/stores/AlertsStore.js