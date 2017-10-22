import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DOMNodeComponent from 'components/shared/DOMNodeComponent';
import ReactDOM from 'react-dom';

class ImageGrid extends PureComponent {
  static propTypes = {
    // The image grid is a backbone component, that is rendered to static HTML
    node: PropTypes.object.isRequired,
    onImageClicked: PropTypes.func.isRequired,
  };

  componentDidMount() {
    // Hacky way to show image viewer when clicking on item in grid
    ReactDOM.findDOMNode(this).addEventListener('click', this._onGridClicked);
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('click', this._onGridClicked);
  }

  _onGridClicked = (e) => {
    const { target } = e;

    const imgSrc = target.getAttribute('data-src');
    if (target.getAttribute('data-src') !== null) {
      const imagePos = target.getBoundingClientRect();
      this.props.onImageClicked(imgSrc, imagePos);
    }
  };

  render() {
    const { node } = this.props;

    return <DOMNodeComponent className="item-image-grid" node={node} />;
  }
}

export default ImageGrid;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/ImageGrid/index.js