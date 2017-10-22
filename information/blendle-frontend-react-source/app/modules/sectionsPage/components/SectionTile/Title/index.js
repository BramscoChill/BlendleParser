import React from 'react';
import classNames from 'classnames';
import { bool, node, number } from 'prop-types';
import {
  TITLE_BREAK_MEDIUM_PX,
  TITLE_BREAK_LARGE_PX,
  TITLE_BREAK_FEATURED_PX,
  TITLE_BREAK_EXTRA_LARGE_PX,
} from '../../../constants';
import CSS from './style.scss';

const titleSizeClass = (tileWidth) => {
  if (tileWidth >= TITLE_BREAK_FEATURED_PX) {
    return CSS.huge;
  }

  if (tileWidth >= TITLE_BREAK_EXTRA_LARGE_PX) {
    return CSS.extraLarge;
  }

  if (tileWidth >= TITLE_BREAK_LARGE_PX) {
    return CSS.large;
  }

  if (tileWidth >= TITLE_BREAK_MEDIUM_PX) {
    return CSS.medium;
  }

  return CSS.small;
};

function Title({ hasBackgroundImage, children, tileWidth }) {
  const classes = classNames(
    CSS.title,
    titleSizeClass(tileWidth),
    hasBackgroundImage && CSS.shadow,
  );
  return <h2 className={classes}>{children}</h2>;
}

Title.propTypes = {
  hasBackgroundImage: bool.isRequired,
  children: node.isRequired,
  tileWidth: number.isRequired,
};

export default Title;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/Title/index.js