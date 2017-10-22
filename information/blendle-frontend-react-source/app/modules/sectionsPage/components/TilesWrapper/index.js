import React from 'react';
import { string, node, number, bool, oneOf } from 'prop-types';
import { times, get } from 'lodash';
import withViewportSize from 'higher-order-components/withViewportSize';
import { DESKTOP_LAYOUTS, MOBILE_LAYOUTS } from '../../constants';
import PlaceholderTile from '../PlaceholderTile';
import getWrapperComponent from '../../helpers/getWrapperComponent';

function hasCSSGridSupport() {
  // If a browser doesn't support `window.CSS.supports`, we can assume they don't support CSS grids
  // either
  if (typeof get(window, 'CSS.supports') !== 'function') {
    return false;
  }

  return window.CSS.supports('display', 'grid');
}

function TilesWrapper({
  sectionId,
  isLoading,
  children,
  tilesCount,
  innerWidth,
  innerHeight,
  desktopLayout,
  isMobileViewport,
  mobileLayout,
}) {
  const WrapperComponent = getWrapperComponent({
    hasCSSGridSupport: hasCSSGridSupport(),
    sectionId,
    isMobileViewport,
    desktopLayout,
    mobileLayout,
  });

  return (
    <WrapperComponent sectionId={sectionId} innerWidth={innerWidth} innerHeight={innerHeight}>
      {isLoading
        ? times(tilesCount, index => <PlaceholderTile key={`placeholder-${index}`} index={index} />)
        : children}
    </WrapperComponent>
  );
}

TilesWrapper.propTypes = {
  sectionId: string.isRequired,
  isLoading: bool.isRequired,
  isMobileViewport: bool.isRequired,
  tilesCount: number.isRequired,
  desktopLayout: oneOf(DESKTOP_LAYOUTS).isRequired,
  mobileLayout: oneOf(MOBILE_LAYOUTS).isRequired,
  children: node.isRequired,
  innerWidth: number.isRequired,
  innerHeight: number.isRequired,
};

export const TilesWrapperComponent = TilesWrapper;
export default withViewportSize({ debounce: 100 })(TilesWrapper);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/TilesWrapper/index.js