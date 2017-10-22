import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SmartCroppedImage from '../SmartCroppedImage';
import CSS from './style.scss';

const MAX_INLINE_IMAGE_WIDTH_PX = 320;

class InlineImage extends PureComponent {
  static propTypes = {
    fragment: PropTypes.object.isRequired,
  };

  render() {
    const { fragment } = this.props;
    const original = fragment.sizes.original;

    const imageWidth = Math.min(original.width, MAX_INLINE_IMAGE_WIDTH_PX);
    const className = classNames('inline-image', CSS.inlineImage, fragment.metadata);

    const cropOptions = {
      width: imageWidth,
      widthInterval: imageWidth !== MAX_INLINE_IMAGE_WIDTH_PX,
    };

    return (
      <div className={`inline-image-container ${CSS.inlineImageContainer}`}>
        <div className={className}>
          <SmartCroppedImage
            className={CSS.imageElement}
            image={fragment}
            cropOptions={cropOptions}
            alt={fragment.caption}
          />
          <div className={CSS.meta}>
            <p
              className={`item-image-caption ${CSS.caption}`}
              dangerouslySetInnerHTML={{ __html: fragment.caption }}
            />
            <p
              className={`item-image-credit ${CSS.credit}`}
              dangerouslySetInnerHTML={{ __html: fragment.credit }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default InlineImage;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemImage/InlineImage/index.js