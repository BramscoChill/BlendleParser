import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ItemActions from 'actions/ItemActions';

class ZoomableImageContainer extends PureComponent {
  static propTypes = {
    image: PropTypes.object,
    children: PropTypes.element,
    active: PropTypes.bool,
  };

  onImageClick = () => {
    const { active, image } = this.props;
    if (!active || !image) {
      return;
    }

    // The image zoom animates from/to the clicked image's position
    const originPosition = this.image.getBoundingClientRect();

    ItemActions.showImageZoom({
      originalImage: image.sizes.original,
      caption: image.caption,
      credit: image.credit,
      originPosition,
    });
  };

  render() {
    const child = React.Children.only(this.props.children);

    return React.cloneElement(child, {
      onClick: this.onImageClick,
      ref: c => (this.image = c),
    });
  }
}

export default ZoomableImageContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ZoomableImageContainer.js