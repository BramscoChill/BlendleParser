import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ItemActions from 'actions/ItemActions';
import { getImages } from 'selectors/content';
import { getPathname } from 'helpers/url';
import ItemStore from 'stores/ItemStore';
import ImageGrid from '../components/ImageGrid';

/**
 * Hacky workaround to find the Original image in the media set based on the src
 * @param {*} content
 * @param {*} imageSrc
 */
function findInMediaSet(content, imageSrc) {
  const imagePath = getPathname(imageSrc);
  const images = getImages(content, { excludeFeaturedImages: false });

  const matchedImage = images.find((image) => {
    const original = image.sizes.original;
    return original.href.indexOf(imagePath) > -1;
  });

  return matchedImage;
}

class ImageGridContainer extends PureComponent {
  static propTypes = {
    node: PropTypes.object.isRequired,
  };

  _onImageClicked = (clickedImageSrc, originPosition) => {
    const itemContent = ItemStore.getState().content;
    const matchedImage = findInMediaSet(itemContent.data, clickedImageSrc);

    ItemActions.showImageZoom({
      originalImage: matchedImage.sizes.original,
      caption: matchedImage.caption,
      credit: matchedImage.credit,
      originPosition,
    });
  };

  render() {
    return <ImageGrid node={this.props.node} onImageClicked={this._onImageClicked} />;
  }
}

export default ImageGridContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ImageGridContainer.js