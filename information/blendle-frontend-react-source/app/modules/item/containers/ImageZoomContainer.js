import React, { PureComponent } from 'react';
import ItemStore from 'stores/ItemStore';
import ItemActions from 'actions/ItemActions';
import ImageZoom from '../components/ImageZoom';
import AltContainer from 'alt-container';

class ImageZoomContainer extends PureComponent {
  _renderZoomedImage = (itemState) => {
    const { activeImage } = itemState;

    if (!activeImage) {
      return null;
    }

    return <ImageZoom image={activeImage} closeZoom={this._closeZoom} />;
  };

  _closeZoom() {
    ItemActions.hideImageZoom();
  }

  render() {
    return <AltContainer store={ItemStore} render={this._renderZoomedImage} />;
  }
}

export default ImageZoomContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ImageZoomContainer.js