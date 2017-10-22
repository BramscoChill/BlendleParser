import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ManifestContainer from 'containers/ManifestContainer';
import SearchContextToastContainer from 'modules/alerts/containers/SearchContextToastContainer';
import classNames from 'classnames';
import moment from 'moment';

class ResultItemTile extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
  };

  render() {
    const { itemId } = this.props;

    const tileClassNames = classNames(['v-tile', 'tile-result', 'v-result-tile', 's-success']);

    return (
      <div className={tileClassNames}>
        <SearchContextToastContainer itemId={itemId} />
        <ManifestContainer
          itemId={itemId}
          analytics={{ type: 'alerts', position: this.props.position }}
          bottomBarDisabled
        />
      </div>
    );
  }
}

export default ResultItemTile;



// WEBPACK FOOTER //
// ./src/js/app/modules/alerts/components/ResultItemTile.js