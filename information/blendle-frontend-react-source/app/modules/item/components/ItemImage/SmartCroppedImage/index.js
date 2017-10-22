import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { smartCropImage } from 'helpers/smartCrop';
import classNames from 'classnames';
import ZoomableImageContainer from 'modules/item/containers/ZoomableImageContainer';
import CSS from './style.scss';

class SmartCroppedImage extends PureComponent {
  static propTypes = {
    image: PropTypes.object.isRequired,
    className: PropTypes.string,
    cropOptions: PropTypes.object,
  };

  render() {
    const { image, cropOptions, className, ...props } = this.props;

    const originalImage = image.sizes.original;
    const href = smartCropImage(originalImage, cropOptions);

    const allowZoom = cropOptions.width < Math.min(originalImage.width, window.innerWidth);

    const imgClasses = classNames(className, {
      [CSS.zoom]: allowZoom,
    });

    return (
      <ZoomableImageContainer image={image} active={allowZoom}>
        <img className={imgClasses} src={href} {...props} />
      </ZoomableImageContainer>
    );
  }
}

export default SmartCroppedImage;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemImage/SmartCroppedImage/index.js