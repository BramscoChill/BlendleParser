import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tile from 'components/Tile';
import Cover from '../Cover';
import { MAX_TILE_HEIGHT } from 'app-constants';

class CoverTile extends Component {
  static propTypes = {
    axis: PropTypes.string,
    availableSize: PropTypes.object,
    issue: PropTypes.object,
    children: PropTypes.any,
  };

  _getStyles() {
    const { axis, availableSize, issue } = this.props;
    const coverSize = {
      width: issue.getCoverWidth(),
      height: issue.getCoverHeight(),
    };

    if (axis === 'x') {
      const ratio = coverSize.width / coverSize.height;
      const height = Math.min(MAX_TILE_HEIGHT, availableSize.height);
      return {
        width: height * ratio,
        height,
      };
    }

    return null;
  }

  render() {
    return (
      <Tile type="cover" style={this._getStyles()}>
        {this.props.children}
        <Cover {...this.props} />
      </Tile>
    );
  }
}

export default CoverTile;



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/CoverTile.js