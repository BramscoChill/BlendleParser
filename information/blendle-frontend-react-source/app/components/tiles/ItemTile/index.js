import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ManifestContainer from 'containers/ManifestContainer';
import ToastContainer from 'containers/ToastContainer';

class ItemTile extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
    analytics: PropTypes.object.isRequired,
    toastDisabled: PropTypes.bool,
    headlineToastEnabled: ToastContainer.propTypes.headlineToastEnabled,
    itemReasonDisabled: ToastContainer.propTypes.itemReasonDisabled,
    tileHeight: ManifestContainer.propTypes.tileHeight,
  };

  _renderToastContainer() {
    if (this.props.toastDisabled) {
      return null;
    }

    const { itemId, headlineToastEnabled, itemReasonDisabled } = this.props;

    return (
      <ToastContainer
        itemId={itemId}
        headlineToastEnabled={headlineToastEnabled}
        itemReasonDisabled={itemReasonDisabled}
      />
    );
  }

  render() {
    const { itemId, tileHeight, analytics } = this.props;

    return (
      <div className="item-tile-container v-tile">
        {this._renderToastContainer()}
        <ManifestContainer itemId={itemId} tileHeight={tileHeight} analytics={analytics} />
      </div>
    );
  }
}

export default ItemTile;



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/ItemTile/index.js