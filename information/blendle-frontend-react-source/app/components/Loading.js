import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const LoadingView = ({ center, square, className }) => {
  const classes = classNames(
    'v-loading',
    {
      center,
      square,
    },
    className,
  );

  return <div className={classes} />;
};

LoadingView.propTypes = {
  center: PropTypes.bool,
  square: PropTypes.bool,
  className: PropTypes.string,
};

export default LoadingView;



// WEBPACK FOOTER //
// ./src/js/app/components/Loading.js