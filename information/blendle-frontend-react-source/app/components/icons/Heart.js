import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

const Heart = ({ fill = 'currentColor', ...props }) => (
  <svg viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill={fill}
      d="M7.24 13.774C1.543 8.813 0 7.066 0 4.23 0 1.897 1.775 0 3.956 0 5.779 0 6.809 1.107 7.5 1.94 8.19 1.107 9.221 0 11.044 0 13.225 0 15 1.897 15 4.23c0 2.836-1.543 4.583-7.24 9.544L7.5 14l-.26-.226z"
    />
  </svg>
);

Heart.propTypes = {
  fill: PropTypes.string,
};

export default pure(Heart);



// WEBPACK FOOTER //
// ./src/js/app/components/icons/Heart.js