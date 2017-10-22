import React from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import Auth from 'controllers/auth';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK } from 'app-constants';
import AlertsPage from 'modules/alerts/components/AlertsPage';
import AlertsActions from 'actions/AlertsActions';
import AlertsStore from 'stores/AlertsStore';
import TilesStore from 'stores/TilesStore';
import { getTimelineTiles } from 'selectors/tiles';

function isLoading(statuses) {
  return statuses.some(status => status === STATUS_PENDING || status === STATUS_INITIAL);
}

class AlertsContainer extends React.Component {
  static propTypes = {
    params: PropTypes.object,
  };

  componentWillMount() {
    AlertsActions.fetchAlerts(Auth.getUser().id, this.props.params.query, this.props.params.new);
  }

  componentWillReceiveProps(nextProps) {
    AlertsActions.fetchAlerts(Auth.getUser().id, nextProps.params.query, nextProps.params.new);
  }

  _onAddAlert(query) {
    AlertsActions.addAlert(Auth.getUser().id, query);
  }

  _onDeleteAlert() {
    const activeAlert = AlertsStore.getState().alert;
    AlertsActions.deleteAlert(activeAlert);
  }

  _onEditAlert(newAttributes) {
    const activeAlert = AlertsStore.getState().alert;
    AlertsActions.editAlert(activeAlert, newAttributes);
  }

  _onNearEnd() {
    const { resultsStatus, next } = AlertsStore.getState();

    if (resultsStatus === STATUS_OK && next) {
      AlertsActions.fetchNextResults(next);
    }
  }

  render() {
    return (
      <AltContainer
        stores={{ AlertsStore, TilesStore }}
        render={stores => (
          <AlertsPage
            results={getTimelineTiles(stores.TilesStore.tiles, stores.AlertsStore.results)}
            showAddAlert={!!this.props.params.new}
            showManager={!!this.props.params.query}
            query={this.props.params.query}
            searchQuery={stores.AlertsStore.searchQuery}
            alertsStore={stores.AlertsStore}
            onSetSearchQuery={AlertsActions.setSearchQuery}
            onAddAlert={this._onAddAlert}
            onClickDelete={this._onDeleteAlert.bind(this)}
            onClickEdit={this._onEditAlert.bind(this)}
            onShowResults={AlertsActions.fetchResults}
            onNearEnd={this._onNearEnd}
            loading={isLoading([stores.AlertsStore.alertsStatus, stores.AlertsStore.resultsStatus])}
          />
        )}
      />
    );
  }
}

export default AlertsContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/AlertsContainer.js