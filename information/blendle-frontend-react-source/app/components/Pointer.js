import React from 'react';
import PropTypes from 'prop-types';

class Pointer extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    position: PropTypes.string,
    direction: PropTypes.string,
    offset: PropTypes.number,
  };

  render() {
    const pointerStyle = {
      borderWidth: `${this.props.width}px`,
      borderStyle: 'solid',
      position: 'absolute',
      display: 'inline-block',
    };

    if (this.props.position === 'top') {
      pointerStyle.borderLeftColor = 'transparent';
      pointerStyle.borderRightColor = 'transparent';
      pointerStyle.borderTop = 'none';
    }

    if (this.props.position === 'bottom') {
      pointerStyle.borderLeftColor = 'transparent';
      pointerStyle.borderRightColor = 'transparent';
      pointerStyle.borderBottom = 'none';
      pointerStyle.borderTopWidth = '5px';
      pointerStyle.borderTopStyle = 'solid';
      pointerStyle.marginTop = 'none';
      pointerStyle.bottom = '4px';
    }

    if (this.props.position === 'bottom' || (this.props.position === 'top' && this.props.offset)) {
      if (this.props.direction === 'left') {
        pointerStyle.right = `${this.props.offset}px`;
      } else {
        pointerStyle.left = `${this.props.offset}px`;
      }
    }

    return <div className="v-pointer" style={pointerStyle} />;
  }
}

export default Pointer;



// WEBPACK FOOTER //
// ./src/js/app/components/Pointer.js