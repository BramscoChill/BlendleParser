import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ManifestContainer from 'containers/ManifestContainer';
import SearchContextToastContainer from 'modules/search/containers/SearchContextToastContainer';

class ResultItemTile extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
    analytics: PropTypes.object.isRequired,
  };

  render() {
    const { itemId } = this.props;

    return (
      <div className="item-tile-container item-strech-tile-container v-tile">
        <SearchContextToastContainer itemId={itemId} />
        <ManifestContainer itemId={itemId} bottomBarDisabled analytics={this.props.analytics} />
      </div>
    );
  }
}

export default ResultItemTile;



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/ResultItemTile.js