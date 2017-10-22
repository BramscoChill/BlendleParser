import alt from 'instances/altInstance';
import { history } from 'byebye';
import TypedError from 'helpers/typederror';
import Analytics from 'instances/analytics';
import * as AlertsManager from 'managers/alerts';
import { XHR_STATUS } from 'app-constants';
import { validTiles } from 'selectors/tiles';

class AlertsActions {
  constructor() {
    this.generateActions(
      'fetchAlertsSuccess',
      'fetchAlertsError',
      'fetchResultsSuccess',
      'fetchResultsError',
      'fetchNextResultsSuccess',
      'setAlert',
      'addAlertError',
      'addAlertSuccess',
      'deleteAlertSuccess',
      'setActive',
      'setInactive',
      'setSearchQuery',
    );
  }

  fetchAlerts(userId, query, alertsOnly = false) {
    AlertsManager.fetchAlerts(userId).then((response) => {
      const alerts = response._embedded.alerts;
      // Add overview alerts for menu
      alerts.unshift({
        _links: {
          results: {
            href: response._links.results.href,
          },
        },
        all: true,
        active: false,
        id: 0,
      });

      this.fetchAlertsSuccess(alerts);

      if (alertsOnly) {
        this.fetchResultsSuccess({ tiles: [], query, next: null });
      }

      if (alerts.length === 0) {
        this.fetchResultsSuccess({ tiles: [], query, next: null });
        history.navigate('alerts/manage/new', { trigger: true });
        return;
      }

      let activeAlert = null;
      if (!query) {
        Analytics.track('View Alerts');
        activeAlert = alerts.find(alert => alert.id === 0);
      } else {
        activeAlert = alerts.find(alert => alert.query === query);
      }

      if (!activeAlert) {
        this.fetchAlertsError({ error: new TypedError(404) });
        return;
      }

      this.setAlert(activeAlert);

      AlertsManager.fetchResults(activeAlert._links.results.href)
        .then(({ tiles, next }) =>
          this.fetchResultsSuccess({
            tiles: validTiles(tiles),
            query,
            next,
          }),
        )
        .catch((error) => {
          this.fetchAlertsError({ error });
          if (error.type !== XHR_STATUS) {
            throw error;
          }
        });
    });

    return null;
  }

  fetchResults(query) {
    if (!query) {
      return;
    }

    Analytics.track('Try Alert', {
      query: query.toLowerCase(),
    });

    AlertsManager.tryAlert(query)
      .then(({ tiles, next }) =>
        this.fetchResultsSuccess({
          tiles: validTiles(tiles),
          query,
          next,
        }),
      )
      .catch((error) => {
        this.fetchAlertsError({ error });
        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return { query }; // eslint-disable-line consistent-return
  }

  fetchNextResults(nextLink) {
    AlertsManager.fetchResults(nextLink)
      .then(({ tiles, next }) =>
        this.fetchNextResultsSuccess({
          tiles: validTiles(tiles),
          next,
        }),
      )
      .catch((error) => {
        this.fetchAlertsError({ error });
        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return null;
  }

  addAlert(userId, query, redirect = true) {
    if (!query) {
      return;
    }

    Analytics.track('Alert Add', {
      alert: query.toLowerCase(),
    });

    AlertsManager.addAlert(userId, query)
      .then(() => {
        if (redirect) {
          history.navigate(`alerts/${encodeURIComponent(query.toLowerCase())}`, { trigger: true });
        }

        this.addAlertSuccess(null);
      })
      .catch((error) => {
        this.addAlertError({ error });
        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return null; // eslint-disable-line consistent-return
  }

  editAlert(alert, { query }) {
    if (!alert) {
      return;
    }

    AlertsManager.editAlert(alert._links.self.href, {
      id: alert.id,
      query,
    })
      .then(() => {
        history.navigate(`alerts/${encodeURIComponent(query)}`, { trigger: true });
      })
      .catch((error) => {
        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return null; // eslint-disable-line consistent-return
  }

  deleteAlert(alert) {
    if (!alert) {
      return;
    }

    Analytics.track('Alert Remove', {
      alert: alert.query.toLowerCase(),
    });

    AlertsManager.deleteAlert(alert._links.self.href)
      .then(() => {
        history.navigate('alerts', { trigger: true });
        this.deleteAlertSuccess({ alertId: alert.id });
      })
      .catch((error) => {
        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return null; // eslint-disable-line consistent-return
  }
}

export default alt.createActions(AlertsActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/AlertsActions.js