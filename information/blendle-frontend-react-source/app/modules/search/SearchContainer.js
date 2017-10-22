import React from 'react';
import PropTypes from 'prop-types';
import { history } from 'byebye';
import AltContainer from 'alt-container';
import i18n from 'instances/i18n';
import AuthStore from 'stores/AuthStore';
import SearchStore from 'stores/SearchStore';
import TilesStore from 'stores/TilesStore';
import SearchActions from 'actions/SearchActions';
import SearchPage from 'modules/search/components/SearchPage';
import { getTimelineTiles } from 'selectors/tiles';
import { STATUS_OK } from 'app-constants';

class SearchContainer extends React.Component {
  static propTypes = {
    params: PropTypes.object,
  };

  componentWillMount() {
    if (this.props.params.splat) {
      this._fetchResults({ keyword: this.props.params.splat });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.splat !== nextProps.params.splat) {
      this._fetchResults({ keyword: nextProps.params.splat });
    }
  }

  _fetchResults = (query) => {
    if (!query.keyword) {
      return;
    }

    const userId = AuthStore.getState().user.id;
    const locale = query.locale ? query.locale : i18n.getCountryCode().toLowerCase();

    history.navigate(`search/${query.keyword}`, { replace: true, trigger: false });
    SearchActions.fetchResults(query.keyword, locale, userId, query.date);
  };

  _onFetchNextResults = () => {
    const { status, next } = SearchStore.getState();

    if (status === STATUS_OK && next) {
      SearchActions.fetchNextResults(next);
    }
  };

  _renderSearch = ({ searchState, tilesState }) => (
    <SearchPage
      status={searchState.status}
      query={searchState.query}
      results={{
        items: getTimelineTiles(tilesState.tiles, searchState.itemIds),
        issues: searchState.issues,
      }}
      onFetchNextResults={this._onFetchNextResults}
      onSearch={this._fetchResults}
      active={searchState.active}
    />
  );

  render() {
    return (
      <AltContainer
        stores={{
          searchState: SearchStore,
          tilesState: TilesStore,
        }}
        render={this._renderSearch}
      />
    );
  }
}

export default SearchContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/search/SearchContainer.js