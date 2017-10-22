import React from 'react';
import { string, number } from 'prop-types';
import classNames from 'classnames';
import CSS from './style.scss';

function PlaceholderTile({ className, index }) {
  return (
    <div className={classNames(CSS.placeholderTile, CSS[`index-${index}`], className)}>
      <div className={CSS.contentRows}>
        <div className={`${CSS.row} ${CSS.row1}`} />
        <div className={`${CSS.row} ${CSS.row2}`} />
        <div className={`${CSS.row} ${CSS.row3}`} />
        <div className={`${CSS.row} ${CSS.row4}`} />
        <div className={`${CSS.row} ${CSS.row5}`} />
      </div>
    </div>
  );
}

PlaceholderTile.propTypes = {
  className: string,
  index: number,
};

PlaceholderTile.defaultProps = {
  className: '',
  index: 0,
};

export default PlaceholderTile;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/PlaceholderTile/index.js