import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_ERROR } from 'app-constants';
import TilePane from 'components/TilePane';
import Tile from 'components/Tile';
import AlertForm from './AlertForm';
import AlertManageForm from './AlertManageForm';
import ResultItemTile from './ResultItemTile';
import NoResultsTile from 'components/tiles/NoResultsTile';
import { translate } from 'instances/i18n';
import { getItemId } from 'selectors/item';

function shouldShowError(state) {
  return [state.alertsStatus, state.resultsStatus].includes(STATUS_ERROR);
}

class AlertsPage extends React.Component {
  static propTypes = {
    showAddAlert: PropTypes.bool.isRequired,
    showManager: PropTypes.bool.isRequired,
    query: PropTypes.string,
    alertsStore: PropTypes.object.isRequired,
    onAddAlert: PropTypes.func.isRequired,
    onClickDelete: PropTypes.func.isRequired,
    onClickEdit: PropTypes.func.isRequired,
    onShowResults: PropTypes.func.isRequired,
    onNearEnd: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    results: PropTypes.array.isRequired,
  };

  state = {
    showManageDialog: false,
  };

  _onChangeQuery(e) {
    this.props.onSetSearchQuery(e.target.value);
  }

  _onClickShowResults(e) {
    e.preventDefault();
    this.props.onShowResults(this.props.searchQuery);
  }

  _onClickAdd() {
    this.props.onAddAlert(this.props.searchQuery);
  }

  _onClickExampleAlert(query) {
    this.props.onSetSearchQuery(query);
    this.props.onShowResults(query);
  }

  _renderTiles() {
    const tiles = [];
    if (this.props.showAddAlert) {
      tiles.push(
        <Tile key="addAlert">
          <AlertForm
            searchQuery={this.props.searchQuery}
            onChangeQuery={this._onChangeQuery.bind(this)}
            onClickShowResults={this._onClickShowResults.bind(this)}
            onClickAdd={this._onClickAdd.bind(this)}
            onClickExampleAlert={this._onClickExampleAlert.bind(this)}
            status={this.props.alertsStore.addAlertStatus}
            error={this.props.alertsStore.error}
          />
        </Tile>,
      );
    }

    if (this.props.showManager) {
      tiles.push(
        <Tile key="manager">
          <AlertManageForm
            onChangeQuery={this._onChangeQuery.bind(this)}
            query={this.props.query}
            searchQuery={this.props.searchQuery}
            onClickDelete={this.props.onClickDelete}
            onClickEdit={this.props.onClickEdit}
            onClickShowResults={this._onClickShowResults.bind(this)}
          />
        </Tile>,
      );
    }

    const results = this.props.results;

    results.forEach((result, i) => {
      tiles.push(
        <Tile type="item" key={`alert-${getItemId(result)}`}>
          <ResultItemTile itemId={getItemId(result)} position={i} />
        </Tile>,
      );
    });

    const { searchQuery, submittedQuery } = this.props.alertsStore;
    const query = this.props.query;
    const didSearch = searchQuery && searchQuery === submittedQuery;

    if (!this.props.loading && (didSearch || query) && (results && !results.length)) {
      tiles.push(<NoResultsTile query={submittedQuery || query} key="no-results" />);
    }

    return tiles;
  }

  render() {
    if (shouldShowError(this.props.alertsStore)) {
      return (
        <div className="v-module v-alerts v-module-content s-error">
          <div className="v-error timeline-error l-alert l-invalid s-success">
            <div className="error-wrapper">
              <div className="error-container">
                <p className="error-message">{translate('alerts.errors.invalid_alert')}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="v-module v-alerts v-module-content s-success">
        <TilePane
          onNearEnd={this.props.onNearEnd}
          loading={this.props.loading}
          active={this.props.alertsStore.active}
        >
          {this._renderTiles()}
        </TilePane>
      </div>
    );
  }
}

export default AlertsPage;



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/components/AlertsPage.js