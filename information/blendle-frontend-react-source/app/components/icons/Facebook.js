import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Facebook extends PureComponent {
  static propTypes = {
    fill: PropTypes.string,
  };

  static defaultProps = {
    fill: 'currentColor',
  };

  render() {
    const { fill, ...props } = this.props;

    return (
      <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          fill={fill}
          d="M17.068 0H.997C.447 0 0 .446 0 .997v16.071c0 .55.446.997.997.997h8.652v-6.996H7.295V8.343H9.65v-2.01c0-2.334 1.425-3.604 3.507-3.604.997 0 1.853.074 2.104.107v2.438l-1.444.002c-1.132 0-1.352.538-1.352 1.327v1.74h2.7l-.352 2.727h-2.348v6.995h4.604c.55 0 .997-.446.997-.996V.997c0-.55-.447-.997-.997-.997z"
        />
      </svg>
    );
  }
}

export default Facebook;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/Facebook.js