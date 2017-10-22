import React, { PureComponent } from 'react';
import { string, number, bool, object, func } from 'prop-types';
import classNames from 'classnames';

class ImageComponent extends PureComponent {
  static propTypes = {
    src: string.isRequired,
    width: number,
    animate: bool,
    height: number,
    alt: string,
    className: string,
    style: object, // eslint-disable-line
    fallback: string,
    onLoad: func,
  };

  static defaultProps = {
    style: {},
    fallback: '',
    alt: '',
    className: '',
    onLoad: () => {},
    width: undefined,
    height: undefined,
    animate: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      error: false,
    };
  }

  componentDidMount() {
    this.preLoad(this.props.src);
  }

  componentWillUnmount() {
    this.destroyPreLoad();
  }

  onLoad = () => {
    this.setState({ ready: true });
    this.props.onLoad(this.props.src);
  };

  onError = () => {
    if (this.props.fallback) {
      this.preLoad(this.props.fallback);
    }
    this.setState({ error: true });
  };

  // Load image via Image because the <img> could be invisible and the browser will not load it
  preLoad(src) {
    this.destroyPreLoad(); // Clean up previous loader

    this.image = new Image();
    this.image.addEventListener('load', this.onLoad);
    this.image.addEventListener('error', this.onError);
    this.image.src = src;
  }

  destroyPreLoad() {
    if (this.image) {
      this.image.removeEventListener('load', this.onLoad);
      this.image.removeEventListener('error', this.onError);
      this.image = null;
    }
  }

  render() {
    const { src, className, fallback, animate, style, alt, ...others } = this.props;
    const { ready, error } = this.state;
    const animateStyle = {};

    if (animate) {
      animateStyle.opacity = ready ? 1 : 0;
      animateStyle.transition = 'opacity 0.5s';
    }

    const imgStyle = Object.assign({}, style, animateStyle);

    const imgClassName = classNames({
      [className]: className,
      's-fallback': error && fallback,
      's-error': error,
      's-ready': ready,
      's-loading': !ready,
    });

    const imgSrc = error && fallback ? fallback : src;

    return <img className={imgClassName} style={imgStyle} src={imgSrc} alt={alt} {...others} />;
  }
}

export default ImageComponent;



// WEBPACK FOOTER //
// ./src/js/app/components/Image.js