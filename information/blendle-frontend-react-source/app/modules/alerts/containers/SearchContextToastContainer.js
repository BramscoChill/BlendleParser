import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Altcontainer from 'alt-container';
import TilesStore from 'stores/TilesStore';
import SearchContextToast from 'modules/alerts/components/SearchContextToast';
import AlertsStore from 'stores/AlertsStore';
import { getDate } from 'selectors/tiles';
import { getSnippet, getTerm } from 'selectors/searchContext';

class SearchContextToastContainer extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
  };

  _renderSearchContext = ({ tilesState, alertsState }) => {
    const { tiles } = tilesState;
    const { itemId } = this.props;
    const queriedAt = alertsState.alert.queried_at;
    const date = getDate(tiles, itemId);
    const alertDate = new Date(queriedAt || new Date(1980, 1, 1));
    const isNew = new Date(date) > alertDate;

    return (
      <SearchContextToast
        term={getTerm(tiles, itemId)}
        snippet={getSnippet(tiles, itemId)}
        date={date}
        isNew={isNew}
      />
    );
  };

  render() {
    return (
      <Altcontainer
        stores={{ tilesState: TilesStore, alertsState: AlertsStore }}
        render={this._renderSearchContext}
      />
    );
  }
}

export default SearchContextToastContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/containers/SearchContextToastContainer.js