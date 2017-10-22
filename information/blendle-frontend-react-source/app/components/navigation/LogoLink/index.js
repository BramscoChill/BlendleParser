import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import classNames from 'classnames';
import { BlendleLogo } from '@blendle/lego';
import Link from 'components/Link';
import CSS from './LogoLink.scss';

const LogoLink = ({ className, ...props }) => {
  const linkClassName = classNames(CSS.link, 'blendle-logo', className);

  return (
    <Link href="/" className={linkClassName}>
      <BlendleLogo {...props} className={CSS.logo} />
    </Link>
  );
};

LogoLink.propTypes = {
  className: PropTypes.string,
};

export default pure(LogoLink);



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/LogoLink/index.js