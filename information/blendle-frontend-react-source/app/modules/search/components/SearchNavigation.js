import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import BrowserEnv from 'instances/browser_environment';
import { translateElement } from 'instances/i18n';
import ModuleNavigationPortal from 'components/moduleNavigation/ModuleNavigationPortal';
import AddAlertContainer from '../AddAlertContainer';

export default class SearchNavigation extends React.Component {
  static propTypes = {
    query: PropTypes.object,
  };

  _getNavigationItems() {
    if (!BrowserEnv.isMobile() || !this.props.query) {
      return [];
    }
    return [
      {
        className: 'search',
        label: translateElement('search.labels.search', [this.props.query.keyword]),
        url: 'search',
      },
      <li>
        <AddAlertContainer layout="link" alert={this.props.query.keyword} />
      </li>,
    ];
  }

  render() {
    return <ModuleNavigationPortal items={this._getNavigationItems()} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/SearchNavigation.js