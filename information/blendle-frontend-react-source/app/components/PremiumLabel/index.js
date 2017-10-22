import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BlendleGuillemet from 'components/icons/BlendleGuillemet';
import CSS from './style.scss';

function PremiumLabel({ className, style, size = 'normal' }) {
  const labelClasses = classNames(CSS.label, className, {
    [CSS.small]: size === 'small',
  });

  return (
    <div className={labelClasses} style={style}>
      <BlendleGuillemet className={CSS.icon} />
      Premium
    </div>
  );
}

PremiumLabel.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOf(['normal', 'small']),
};

export default PremiumLabel;



// WEBPACK FOOTER //
// ./src/js/app/components/PremiumLabel/index.js