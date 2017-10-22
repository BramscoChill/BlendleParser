import React from 'react';
import PropTypes from 'prop-types';

const Check = ({ className, fill }) => (
  <svg viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g>
      <path
        d="M6,16 L0.41264648,9.91162109 L2.43920898,7.82958984 L6,11.6953125 L15.9,1.8 L18,4 L6,16 Z"
        fill={fill}
      />
    </g>
  </svg>
);

Check.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
};

Check.defaultProps = {
  fill: 'currentColor',
};

export default Check;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/Check.js