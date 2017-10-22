import React, { cloneElement } from 'react';
import { node, number } from 'prop-types';
import { getSizeForAspectRatio } from 'helpers/aspectRatio';
import { VERTICAL_TILE_ASPECT_RATIO } from '../../constants';
import CSS from './style.scss';

const SIDE_PADDING_PX = 20;

function WrappingSection({ children, innerWidth }) {
  const tileDimensions = getSizeForAspectRatio({
    width: Math.min(innerWidth - SIDE_PADDING_PX, 800),
    aspectRatio: VERTICAL_TILE_ASPECT_RATIO,
  });

  return (
    <div>
      {React.Children.map(
        children,
        child =>
          child && (
            <div style={tileDimensions} className={CSS.wrappingTileContainer}>
              {cloneElement(child, {
                tileWidth: tileDimensions.width,
                tileHeight: tileDimensions.height,
              })}
            </div>
          ),
      )}
    </div>
  );
}

WrappingSection.propTypes = {
  children: node.isRequired,
  innerWidth: number.isRequired,
};

export default WrappingSection;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/WrappingSection/index.js