import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import Image from 'components/Image';
import { translate } from 'instances/i18n';
import { getManifestImageHref } from 'selectors/itemImage';
import { smartCropImages } from 'config/features';
import classNames from 'classnames';
import stripTags from 'underscore.string/stripTags';

const MANIFEST_TYPES = {
  rectangleNoImage: 'manifest-rectangle-no-image',
  rectangleLandscapeImage: 'manifest-rectangle-landscape-image',
};

const LANDSCAPE_IMAGE_WIDTH = 310;
const LANDSCAPE_IMAGE_HEIGHT = 168;

function getRenderType(hasImage) {
  if (hasImage) {
    return MANIFEST_TYPES.rectangleLandscapeImage;
  }

  return MANIFEST_TYPES.rectangleNoImage;
}

class DefaultManifestContent extends React.Component {
  static propTypes = {
    onOpen: PropTypes.func.isRequired,
    analytics: PropTypes.object.isRequired,
    itemContent: PropTypes.arrayOf(PropTypes.element).isRequired,
    setRenderedType: PropTypes.func,
    hideImage: PropTypes.bool,
    className: PropTypes.string,
    itemURI: PropTypes.string.isRequired,
    manifest: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.image = this._getImage();
    const renderedType = getRenderType(!!this.image);

    if (this.props.setRenderedType) {
      this.props.setRenderedType(renderedType);
    }

    const tags = this.props.analytics.tags || [];
    this.analytics = {
      ...this.props.analytics,
      tags: [...tags, renderedType],
    };
  }

  _getImage() {
    if (this.props.hideImage) {
      return null;
    }

    const smartCropOptions = {
      width: LANDSCAPE_IMAGE_WIDTH,
      height: LANDSCAPE_IMAGE_HEIGHT,
      widthInterval: false,
      heightInterval: false,
    };

    return getManifestImageHref(this.props.manifest, {
      smartCrop: smartCropImages,
      smartCropOptions,
      criteria: {
        minWidth: smartCropOptions.width,
        minHeight: smartCropOptions.height,
        hasCredits: true,
      },
    });
  }

  _renderExcerpt(itemContent) {
    return (
      <Link
        href={`${this.props.itemURI}`}
        className="item-excerpt"
        onClick={this.props.onOpen}
        analytics={this.analytics}
      >
        {itemContent}
      </Link>
    );
  }

  _renderImage(image) {
    if (!image) {
      return null;
    }

    const className = classNames('item-image', {
      cropped: image.smartCrop,
    });

    return (
      <div className={className}>
        <div className="image-canvas">
          <Link
            href={`${this.props.itemURI}`}
            onClick={this.props.onOpen}
            analytics={this.analytics}
          >
            <Image src={image.href} />
          </Link>
        </div>

        {this._renderImageCredits()}
      </div>
    );
  }

  _renderImageCredits() {
    const credits = this.image && this.image.credit;
    if (!credits) {
      return null;
    }

    return <div className="credits">{stripTags(credits)}</div>;
  }

  render() {
    const className = classNames(this.props.className, 'manifest-content', 'default-tile', {
      'has-image': !!this.image,
    });

    return (
      <div className={className}>
        {this._renderImage(this.image)}
        {this._renderExcerpt(this.props.itemContent)}
      </div>
    );
  }
}

export default DefaultManifestContent;



// WEBPACK FOOTER //
// ./src/js/app/containers/ManifestContainer/components/DefaultManifestContent.js