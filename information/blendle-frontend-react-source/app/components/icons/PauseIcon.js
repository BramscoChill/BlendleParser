import React from 'react';
import { string } from 'prop-types';

function PauseIcon({ fill, ...props }) {
  return (
    <svg height="24" width="24" fill={fill} viewBox="0 0 24 24" {...props}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}
PauseIcon.propTypes = {
  fill: string,
};

PauseIcon.defaultProps = {
  fill: 'currentColor',
};

export default PauseIcon;



// WEBPACK FOOTER //
// ./src/js/app/components/icons/PauseIcon.js