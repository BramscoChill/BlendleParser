import React from 'react';
import { node } from 'prop-types';
import CSS from './style.scss';

function SectionTitle({ children }) {
  return <h2 className={CSS.title}>{children}</h2>;
}

SectionTitle.propTypes = {
  children: node,
};

SectionTitle.defaultProps = {
  children: null,
};

export default SectionTitle;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionHeader/SectionTitle/index.js