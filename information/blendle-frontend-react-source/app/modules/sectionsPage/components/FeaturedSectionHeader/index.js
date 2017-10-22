import React from 'react';
import { node } from 'prop-types';
import SectionTitle from '../SectionHeader/SectionTitle';
import CSS from './style.scss';

function FeaturedSectionHeader({ title }) {
  return (
    <header className={CSS.featuredSectionHeader}>
      {title && <SectionTitle>{title}</SectionTitle>}
    </header>
  );
}

FeaturedSectionHeader.propTypes = {
  title: node,
};

FeaturedSectionHeader.defaultProps = {
  title: null,
};

export default FeaturedSectionHeader;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/FeaturedSectionHeader/index.js