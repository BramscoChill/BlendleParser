import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSS from './style.scss';

const UserAvatar = ({ url, className, ...rest }) => {
  const classes = classNames(CSS.avatar, {
    [className]: className,
  });

  return (
    <svg className={classes} {...rest} width="100%" height="100%" viewBox="0 0 612 612">
      <defs>
        <clipPath id="supercircle">
          <path d="M612 306c-1.1 96.9-23.1 178.8-75.6 230.4-51.6 52.5-133.5 74.5-230.4
              75.6-96.9-1.1-178.8-23.1-230.4-75.6C23.1 484.8 1.1 402.9 0 306c1.1-96.9 23.1-178.8
              75.6-230.4C127.2 23.1 209.1 1.1 306 0c96.9 1.1 178.8 23.1 230.4 75.6 52.4 51.6 74.5
              133.5 75.6 230.4z"
          />
        </clipPath>
      </defs>
      <g>
        <image
          x="0"
          y="0"
          width="100%"
          height="100%"
          clipPath="url(#supercircle)"
          xlinkHref={url}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </svg>
  );
};

UserAvatar.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default UserAvatar;



// WEBPACK FOOTER //
// ./src/js/app/components/UserAvatar/index.js