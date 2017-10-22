import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tile from 'components/Tile';
import TilePane from 'components/TilePane';
import ItemTile from 'components/tiles/ItemTile';
import Measure from 'react-measure';
import BrowserEnvironment from 'instances/browser_environment';
import PopularInIssueTile from 'components/tiles/PopularInIssueTile';
import { getItemId } from 'selectors/item';

const TILE_ANALYTICS = { type: 'issue' };

class TilesIssue extends Component {
  static propTypes = {
    issue: PropTypes.object,
    onNearEnd: PropTypes.func.isRequired,
    onEnd: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    mobileNavigation: PropTypes.any.isRequired,
    tiles: PropTypes.array.isRequired,
    popularItems: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      paneHeight: null,
    };
  }

  _renderPopular() {
    return (
      <PopularInIssueTile
        key={`popular-in-issue-${this.props.issue.id}`}
        providerId={this.props.issue.get('provider').id}
        items={this.props.popularItems}
        issue={this.props.issue}
      />
    );
  }

  _renderArticles() {
    const { tiles } = this.props;

    return tiles.map(item => (
      <Tile type="item" key={`${'issue'}-${getItemId(item)}`}>
        <ItemTile
          itemId={getItemId(item)}
          analytics={TILE_ANALYTICS}
          tileHeight={this.state.paneHeight}
          toastDisabled
        />
      </Tile>
    ));
  }

  _renderTiles() {
    if (this.props.loading || !this.state.paneHeight) {
      return null;
    }

    return [this._renderPopular(), ...this._renderArticles()];
  }

  _renderMobileNavigation() {
    if (BrowserEnvironment.isMobile()) {
      return this.props.mobileNavigation;
    }

    return null;
  }

  render() {
    return (
      <div>
        <Measure onMeasure={({ height }) => this.setState({ paneHeight: height })}>
          <TilePane
            showButtons={!!BrowserEnvironment.isDesktop()}
            active={!this.props.disabled}
            loading={this.props.loading}
            orientation={BrowserEnvironment.isMobile() ? 'vertical' : 'horizontal'}
            onEnd={this.props.onEnd}
            onNearEnd={this.props.onNearEnd}
          >
            {this._renderMobileNavigation()}
            {this._renderTiles()}
          </TilePane>
        </Measure>
      </div>
    );
  }
}

export default TilesIssue;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/TilesIssue.js