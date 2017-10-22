import React from 'react';
import PropTypes from 'prop-types';

const RecommendHeart = ({ fill = 'url(#linearGradient-1)', stroke = 'none', ...props }) => (
  <svg
    width="60px"
    height="52px"
    viewBox="-2 -2 64 56"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <defs>
      <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="linearGradient-1">
        <stop stopColor="#FF6255" offset="0%" />
        <stop stopColor="#FF0E61" offset="100%" />
      </linearGradient>
    </defs>
    <g id="Page-1" stroke={stroke} strokeWidth="2" fill={fill} fillRule="evenodd">
      <path
        id="recommend-heart"
        d="M44.0627456,0 C39.8054949,0 35.8031974,1.61546343 32.7936116,4.54813584 C31.66807,5.64434317 30.7319031,6.87615033 30.0001672,8.20509392 C29.2684313,6.87615033 28.3329336,5.64434317 27.2077266,4.54813584 C24.1964678,1.61546343 20.1948395,0 15.9375888,0 C11.6803381,0 7.67804065,1.61546343 4.66812023,4.54813584 C1.65786523,7.48048229 0,11.3796295 0,15.5268331 C0,19.6743627 1.65819982,23.5735099 4.66812023,26.5058564 L27.2515571,49.9799482 C27.9612104,50.7244434 28.9572679,51.147541 29.9998326,51.147541 C31.0423973,51.147541 32.0384548,50.7244434 32.7477735,49.9799482 L55.3325487,26.5058564 C58.3418,23.5735099 59.9999998,19.6743627 59.9999998,15.5268331 C60.000669,11.3793035 58.3424691,7.48015633 55.3332179,4.54813584 C52.3219591,1.61546343 48.3203309,0 44.0627456,0 Z"
      />
    </g>
  </svg>
);

RecommendHeart.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
};

export default RecommendHeart;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/RecommendHeart.js