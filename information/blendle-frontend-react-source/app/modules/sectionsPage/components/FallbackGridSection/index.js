import React from 'react';
import { string } from 'prop-types';
import classNames from 'classnames';
import HorizontalSection from '../HorizontalSection';
import CSS from './style.scss';

function FallbackGridSection({ className, ...props }) {
  return (
    <HorizontalSection {...props} className={classNames(CSS.fallbackGridSection, className)} />
  );
}

FallbackGridSection.propTypes = {
  className: string,
};

FallbackGridSection.defaultProps = {
  className: '',
};

export default FallbackGridSection;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/FallbackGridSection/index.js