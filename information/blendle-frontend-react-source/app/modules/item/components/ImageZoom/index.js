import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { throttle } from 'lodash';
import { keyCode } from 'app-constants';
import CloseButton from '../CloseButton';
import CSS from './style.scss';

const ANIMATION_DURATION_MS = 300;

const zoomImageStyle = {
  cursor: 'zoom-out',
  position: 'absolute',
  transition: `transform ${ANIMATION_DURATION_MS}ms`,
  transform: 'translate3d(0, 0, 0) scale(1)',
  transformOrigin: 'center center',
  willChange: 'transform, top, left',
};

function getZoomScale({ width, height, zoomMargin = 20 }) {
  const scaleX = window.innerWidth / (width + zoomMargin);
  const scaleY = window.innerHeight / (height + zoomMargin);

  return Math.min(scaleX, scaleY);
}

function getZoomImageStyle(image, isZoomed) {
  const { originPosition } = image;

  const { top, left, width, height } = originPosition;
  const style = { top, left, width, height };

  if (!isZoomed) {
    return {
      ...zoomImageStyle,
      ...style,
    };
  }

  // Get the the coords for center of the viewport
  const viewportX = window.innerWidth / 2;
  const viewportY = window.innerHeight / 2;

  // Get the coords for center of the original image
  const imageCenterX = left + width / 2;
  const imageCenterY = top + height / 2;

  // Get offset amounts for image coords to be centered on screen
  const translateX = viewportX - imageCenterX;
  const translateY = viewportY - imageCenterY;

  const scale = getZoomScale({ width, height });
  const zoomStyle = {
    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
  };

  return {
    ...zoomImageStyle,
    ...style,
    ...zoomStyle,
  };
}

class ImageZoom extends PureComponent {
  static propTypes = {
    image: PropTypes.object.isRequired,
    className: PropTypes.string,
    closeZoom: PropTypes.func,
  };

  state = {
    imageLoaded: false,
    imageZoomed: true,
  };

  componentDidMount() {
    this._throttleScroll = throttle(this._onScroll, 10);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('scroll', this._onScroll);

    const { href } = this.props.image;
    const img = new Image();
    img.src = href;
    img.onload = () => {
      setTimeout(() => this.setState({ imageLoaded: true }));
    };

    this._preloadImage = img;
  }

  componentWillUnmount() {
    this._throttleScroll.cancel();
    this._preloadImage.onload = () => {};
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('scroll', this._onScroll);
  }

  _onScroll = () => {
    if (this.state.imageZoomed) {
      this._closeZoom();
    }
    this.forceUpdate();
  };

  _closeZoom = () => {
    this.setState({ imageZoomed: false }, () =>
      setTimeout(() => this.props.closeZoom(), ANIMATION_DURATION_MS),
    );
  };

  _onKeyUp = (e) => {
    if (e.keyCode === keyCode.ESC) {
      this._closeZoom();
    }
  };

  _renderCaption() {
    const { imageLoaded, imageZoomed } = this.state;
    const { caption, credit, originPosition } = this.props.image;

    const hasCaption = !!caption || !!credit;
    if (!imageLoaded || !imageZoomed || !hasCaption) {
      return null;
    }

    const { width, height } = originPosition;
    const scale = getZoomScale({ width, height });

    return (
      <figcaption
        className={CSS.figCaption}
        style={{
          fontSize: `${(12 / scale).toFixed(2)}px`, // 12px, scaled to the transform: scale() value
        }}
      >
        {caption && <span className={CSS.caption} dangerouslySetInnerHTML={{ __html: caption }} />}
        {credit && <span className={CSS.credit} dangerouslySetInnerHTML={{ __html: credit }} />}
      </figcaption>
    );
  }

  render() {
    const { image } = this.props;
    if (!image) {
      return null;
    }

    const { imageLoaded, imageZoomed } = this.state;
    const isVisible = imageLoaded && imageZoomed;
    const imageStyle = getZoomImageStyle(image, isVisible);
    const overlayClasses = classNames(CSS.overlay, {
      [CSS.visible]: isVisible,
    });

    return (
      <div className={CSS.wrapper}>
        <div className={overlayClasses}>
          <CloseButton onClick={this._closeZoom} />
        </div>
        <figure style={imageStyle} onClick={this._closeZoom} className={CSS.figure}>
          <img src={image.href} className={CSS.img} role="presentation" />
          {this._renderCaption()}
        </figure>
      </div>
    );
  }
}

export default ImageZoom;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ImageZoom/index.js