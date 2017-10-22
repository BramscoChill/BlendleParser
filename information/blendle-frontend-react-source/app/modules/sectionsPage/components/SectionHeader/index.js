import React from 'react';
import { node } from 'prop-types';
import SectionTitle from './SectionTitle';
import SectionSubtitle from './SectionSubtitle';
import CSS from './style.scss';

function SectionHeader({ title, subtitle }) {
  return (
    <header className={CSS.sectionHeader}>
      {title && <SectionTitle>{title}</SectionTitle>}
      {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
    </header>
  );
}

SectionHeader.propTypes = {
  title: node,
  subtitle: node,
};

SectionHeader.defaultProps = {
  title: null,
  subtitle: null,
};

export default SectionHeader;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionHeader/index.js