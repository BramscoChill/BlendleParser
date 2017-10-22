import React from 'react';
import PropTypes from 'prop-types';
import ModuleNavigation from 'components/moduleNavigation/ModuleNavigation';
import { get, capitalize } from 'lodash';
import { translate } from 'instances/i18n';
import { isMobile } from 'instances/browser_environment';
import { getComponents } from 'helpers/moduleNavigationHelpers';
import { history } from 'byebye';

export default class AlertsNavigation extends React.Component {
  static propTypes = {
    onClickMobileSettings: PropTypes.func.isRequired,
    alertsStore: PropTypes.object.isRequired,
    query: PropTypes.string,
  };

  _renderMobileDetailNavigation(query) {
    const items = [
      {
        label: ' ',
        url: 'alerts',
        className: 'btn btn-back',
      },
      {
        label: translate('alerts.label.mobile_alert', [capitalize(query)]),
        url: `alerts/${encodeURIComponent(query)}`,
        className: 'alert l-single',
      },
      {
        label: ' ',
        url: `alerts/${encodeURIComponent(query)}`,
        className: 'btn btn-edit',
        onClick: this.props.onClickMobileSettings,
      },
    ];

    return <ModuleNavigation children={getComponents(items, history.fragment)} />;
  }

  render() {
    if (isMobile() && this.props.query) {
      return this._renderMobileDetailNavigation(this.props.query);
    }

    const defaultItems = [
      {
        key: 'manage',
        label: '',
        className: 'btn btn-icon btn-no-text btn-add-alert',
        url: 'alerts/manage/new',
      },
      {
        key: 'overview',
        label: translate('app.text.overview'),
        url: 'alerts',
      },
    ];

    const alerts = this.props.alertsStore.alerts;

    const alertItems = alerts
      .filter(alert => alert.id !== 0) // Remove overview alert
      .map(alert => ({
        key: alert.id,
        label: capitalize(alert.query),
        url: `alerts/${encodeURIComponent(alert.query)}`,
        className: 'alert',
      }));

    const items = getComponents(defaultItems.concat(alertItems), history.fragment);
    return <ModuleNavigation children={items} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/components/AlertsNavigation.js