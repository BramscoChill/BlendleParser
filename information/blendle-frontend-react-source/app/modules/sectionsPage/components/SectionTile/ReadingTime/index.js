import React from 'react';
import { bool, node } from 'prop-types';
import classNames from 'classnames';
import CSS from './style.scss';

function ReadingTime({ hasBackgroundImage, children }) {
  return (
    <span className={classNames(CSS.readingTime, hasBackgroundImage && CSS.shadow)}>
      {children}
    </span>
  );
}

ReadingTime.propTypes = {
  hasBackgroundImage: bool.isRequired,
  children: node.isRequired,
};

export default ReadingTime;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/ReadingTime/index.js