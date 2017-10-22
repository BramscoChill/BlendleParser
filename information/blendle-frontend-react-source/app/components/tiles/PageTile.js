import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tile from 'components/Tile';
import Page from 'modules/issue/components/Page';
import { MAX_TILE_HEIGHT } from 'app-constants';

function getWidth(page) {
  return page._links.preview.width;
}

function getHeight(page) {
  return page._links.preview.height;
}

function getPreview(page) {
  return page._links.preview.href;
}

class PageTile extends PureComponent {
  static propTypes = {
    axis: PropTypes.string,
    availableSize: PropTypes.object,
    page: PropTypes.object.isRequired,
  };

  _getStyles() {
    const { axis, availableSize, page } = this.props;
    const pageSize = {
      width: getWidth(page),
      height: getHeight(page),
    };

    if (axis === 'x') {
      const ratio = pageSize.width / pageSize.height;
      const height = Math.min(MAX_TILE_HEIGHT, availableSize.height);
      return {
        width: height * ratio,
        height,
      };
    }

    return null;
  }

  render() {
    const { page } = this.props;

    return (
      <Tile type="page" style={this._getStyles()} {...this.props}>
        <Page
          width={getWidth(page)}
          height={getHeight(page)}
          preview={getPreview(page)}
          items={page.items}
        />
      </Tile>
    );
  }
}

export default PageTile;



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/PageTile.js