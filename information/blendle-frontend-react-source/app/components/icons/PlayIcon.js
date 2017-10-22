import React from 'react';
import { string } from 'prop-types';

function PlayIcon({ fill, ...props }) {
  return (
    <svg height="24" width="24" fill={fill} viewBox="0 0 24 24" {...props}>
      <path d="M8 5v14l11-7z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}
PlayIcon.propTypes = {
  fill: string,
};

PlayIcon.defaultProps = {
  fill: 'currentColor',
};

export default PlayIcon;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/PlayIcon.js