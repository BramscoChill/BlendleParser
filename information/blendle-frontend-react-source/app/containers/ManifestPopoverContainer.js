import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BrowserEnvironment from 'instances/browser_environment';
import ManifestContainer from 'containers/ManifestContainer';
import PortalPopover from 'components/PortalPopover';
import TileActions from 'actions/TileActions';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import AltContainer from 'alt-container';

class ManifestPopoverContainer extends Component {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    from: PropTypes.string,
  };

  componentDidMount() {
    const { itemId } = this.props;
    const userId = AuthStore.getState().user.id;

    if (!TilesStore.getState().tiles.get(itemId)) {
      TileActions.fetchTile(userId, itemId);
    }
  }

  _onScroll = (e) => {
    const isStockAndroid = window.BrowserDetect.browser === 'Android Browser';
    if (isStockAndroid && parseFloat(window.BrowserDetect.version) <= 4.3) {
      return;
    }

    // This hack is needed to make sure the manifest is removed in some cases
    // https://github.com/blendle/blendle-web-client/pull/4343
    this.props.onClose(e);
  };

  _renderPopover = ({ tilesState }) => {
    const { itemId } = this.props;

    if (tilesState.tiles.get(itemId)) {
      return (
        <PortalPopover
          layout="manifest"
          x={this.props.x}
          y={this.props.y}
          offset={20}
          mobile={BrowserEnvironment.isMobile()}
          viewportOffsetTop={112}
          viewportOffsetBottom={0}
          viewportOffsetLeft={40}
          viewportOffsetRight={40}
          onClose={this.props.onClose}
          onScroll={this._onScroll}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
        >
          <ManifestContainer
            itemId={this.props.itemId}
            analytics={{ type: this.props.from }}
            hideImage
            onNavigate={this.props.onClose}
          />
        </PortalPopover>
      );
    }

    return null;
  };

  render() {
    return <AltContainer stores={{ tilesState: TilesStore }} render={this._renderPopover} />;
  }
}

export default ManifestPopoverContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/ManifestPopoverContainer.js