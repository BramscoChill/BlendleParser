import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';

function getStyle({ region }) {
  return {
    left: `${region.position[0]}%`,
    right: `${100 - region.position[2]}%`,
    top: `${region.position[1]}%`,
    bottom: `${100 - region.position[3]}%`,
    position: 'absolute',
  };
}

const Region = ({ region, onClick, onMouseMove, onMouseLeave, onMouseEnter, url }) => (
  <Link
    href={url}
    className="v-page-item-region"
    style={getStyle({ region })}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseMove={onMouseMove}
    onMouseLeave={onMouseLeave}
    analytics={{ type: 'page' }}
  />
);

Region.propTypes = {
  region: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseEnter: PropTypes.func,
  url: PropTypes.string.isRequired,
};

export default Region;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/components/Region.js