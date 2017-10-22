import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FullWidthImage from './FullWidthImage';
import { isTabletBreakpoint } from 'helpers/viewport';
import InlineImage from './InlineImage';

function isFullWidthImage(imageWidth, imageHeight) {
  const isLandscape = imageWidth >= imageHeight;

  return isTabletBreakpoint() || isLandscape;
}

class ItemImage extends PureComponent {
  static propTypes = {
    fragment: PropTypes.object.isRequired,
  };

  render() {
    const { fragment } = this.props;
    const originalImage = fragment.sizes.original;
    const isFullWidth = isFullWidthImage(originalImage.width, originalImage.height);

    if (isFullWidth) {
      return <FullWidthImage fragment={fragment} />;
    }

    return <InlineImage fragment={fragment} />;
  }
}

export default ItemImage;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ItemImage/index.js