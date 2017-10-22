import React from 'react';
import classNames from 'classnames';
import { node, number } from 'prop-types';
import { MAX_SECTION_WIDTH_PX } from '../../../constants';
import CSS from './style.scss';

function Intro({ children, tileWidth }) {
  return (
    <p className={classNames(CSS.intro, tileWidth === MAX_SECTION_WIDTH_PX && CSS.large)}>
      {children}
    </p>
  );
}

Intro.propTypes = {
  tileWidth: number.isRequired,
  children: node,
};

Intro.defaultProps = {
  children: null,
};

export default Intro;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/Intro/index.js