import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import browserEnv from 'instances/browser_environment';
import { STATUS_PENDING, STATUS_OK } from 'app-constants';
import { translate } from 'instances/i18n';
import TilePane from 'components/TilePane';
import Tile from 'components/Tile';
import CoverTile from 'components/tiles/CoverTile';
import QueryForm from './QueryForm';
import ResultItemTile from './ResultItemTile';
import NoResultsTile from 'components/tiles/NoResultsTile';
import { sortedIssues } from 'selectors/issues';
import { getItemId } from 'selectors/item';
import SearchNavigation from './SearchNavigation';

class SearchPage extends PureComponent {
  static propTypes = {
    query: PropTypes.object,
    status: PropTypes.number,
    results: PropTypes.object,
    onFetchNextResults: PropTypes.func,
    onSearch: PropTypes.func,
    onAddAlert: PropTypes.func,
    active: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this._analyticsCache = new Map();
  }

  componentWillUnmount() {
    this._analyticsCache = new Map();
  }

  _getAnalytics(query, index) {
    if (!this._analyticsCache.get(index)) {
      this._analyticsCache.set(index, {
        type: 'search',
        query,
        position: index,
      });
    }

    return this._analyticsCache.get(index);
  }

  _renderTileLabel(index, translationKey) {
    if (index > 0 || browserEnv.isMobile()) {
      return null;
    }

    return (
      <div className="tile-label">
        <h2>{translate(translationKey)}</h2>
      </div>
    );
  }

  _renderTiles() {
    const tiles = [];
    const resultsCount = this.props.results.issues.length + this.props.results.items.length;

    if (!browserEnv.isMobile()) {
      tiles.push(
        <Tile key="search">
          <QueryForm
            query={this.props.query}
            onSearch={this.props.onSearch}
            onAddAlert={this.props.onAddAlert}
          />
        </Tile>,
      );
    }

    sortedIssues(this.props.results.issues).forEach((issue, index) => {
      tiles.push(
        <CoverTile key={issue.id} issue={issue}>
          {this._renderTileLabel(index, 'search.titles.latests_issues')}
        </CoverTile>,
      );
    });

    this.props.results.items.forEach((item, index) => {
      tiles.push(
        <Tile type="item" key={`search-tile-${getItemId(item)}`}>
          {this._renderTileLabel(index, 'search.titles.articles')}
          <ResultItemTile
            itemId={getItemId(item)}
            analytics={this._getAnalytics(this.props.query.keyword, index)}
          />
        </Tile>,
      );
    });

    // no results, since we're having only the query form tile
    if (this.props.status === STATUS_OK && resultsCount === 0) {
      tiles.push(<NoResultsTile query={this.props.query.keyword} key="no-results" />);
    }

    return tiles;
  }

  _renderNavigation() {
    return <SearchNavigation query={this.props.query} />;
  }

  render() {
    return (
      <div className="v-module v-timeline v-module-content s-success">
        <TilePane
          loading={this.props.status === STATUS_PENDING}
          tileOffset={40}
          onNearEnd={this.props.onFetchNextResults}
          active={this.props.active}
        >
          {this._renderTiles()}
        </TilePane>
        {this._renderNavigation()}
      </div>
    );
  }
}

export default SearchPage;



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/SearchPage.js