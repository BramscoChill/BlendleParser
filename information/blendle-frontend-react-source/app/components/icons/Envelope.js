import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

class Envelope extends PureComponent {
  static propTypes = {
    fill: PropTypes.string,
  };

  static defaultProps = {
    fill: 'currentColor',
  };

  render() {
    const { fill, ...props } = this.props;

    return (
      <svg viewBox="0 0 18 13" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          fill={fill}
          d="M5.878 6.822c.232-.21.232-.555.001-.765L.278.949C.1 1.24 0 1.58 0 1.94v9.058c0 .338.088.657.246.936l5.632-5.111zm5.551.61c-.23-.21-.61-.21-.842 0L9.405 8.505c-.232.21-.61.21-.842 0L7.328 7.377c-.231-.21-.61-.21-.842-.001l-5.699 5.17c.332.246.745.394 1.195.394h13.954c.425 0 .819-.133 1.141-.356L11.43 7.433zm6.243-6.428L12.04 6.115c-.231.21-.232.554 0 .765l5.6 5.108c.178-.292.28-.63.28-.991V1.939c0-.338-.09-.657-.247-.935zM8.563 7.397c.232.21.61.211.843.001L17.129.392C16.799.146 16.385 0 15.936 0H1.98C1.556 0 1.162.132.84.354l7.724 7.043z"
        />
      </svg>
    );
  }
}

export default Envelope;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/Envelope.js