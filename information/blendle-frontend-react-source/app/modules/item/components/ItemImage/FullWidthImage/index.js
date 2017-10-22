import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { maintainAspectRatio } from 'helpers/aspectRatio';
import SmartCroppedImage from '../SmartCroppedImage';
import CSS from './style.scss';

class FullWidthImage extends PureComponent {
  static propTypes = {
    fragment: PropTypes.object.isRequired,
  };

  render() {
    const { fragment } = this.props;
    const original = fragment.sizes.original;
    const maxSize = maintainAspectRatio({
      width: original.width,
      height: original.height,
      maxWidth: Math.min(original.width, window.innerWidth),
      maxHeight: window.innerHeight * 0.8,
    });

    const cropOptions = {
      width: maxSize.width,
      widthInterval: maxSize.width !== original.width,
    };

    return (
      <div className={`inline-image-container ${CSS.fullWidthImage}`}>
        <SmartCroppedImage
          className={CSS.imageElement}
          image={fragment}
          cropOptions={cropOptions}
        />
        <div className={`item-image-meta ${CSS.meta}`}>
          <p className={CSS.caption} dangerouslySetInnerHTML={{ __html: fragment.caption }} />
          <p className={CSS.credit} dangerouslySetInnerHTML={{ __html: fragment.credit }} />
        </div>
      </div>
    );
  }
}

export default FullWidthImage;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemImage/FullWidthImage/index.js