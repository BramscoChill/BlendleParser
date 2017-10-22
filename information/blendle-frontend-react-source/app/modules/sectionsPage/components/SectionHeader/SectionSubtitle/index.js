import React from 'react';
import { node } from 'prop-types';
import CSS from './style.scss';

function SectionSubtitle({ children }) {
  return <p className={CSS.subtitle}>{children}</p>;
}

SectionSubtitle.propTypes = {
  children: node,
};

SectionSubtitle.defaultProps = {
  children: null,
};

export default SectionSubtitle;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionHeader/SectionSubtitle/index.js