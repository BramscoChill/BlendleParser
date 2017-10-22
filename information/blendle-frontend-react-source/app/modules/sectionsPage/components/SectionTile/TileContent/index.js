import React from 'react';
import { node } from 'prop-types';
import { Parallax } from '@blendle/lego';
import { DESKTOP_NAVIGATION_HEIGHT_PX } from 'app-constants';
import { PARALLAX_DISTANCE_PX } from '../../../constants';
import { featuresPropType, parallaxScrolling } from '../features';

function TileContent({ children, features, ...props }) {
  if (features.includes(parallaxScrolling)) {
    return (
      <Parallax distance={PARALLAX_DISTANCE_PX} offset={DESKTOP_NAVIGATION_HEIGHT_PX} {...props}>
        {children}
      </Parallax>
    );
  }

  return <div {...props}>{children}</div>;
}

TileContent.propTypes = {
  children: node,
  features: featuresPropType.isRequired,
};

TileContent.defaultProps = {
  children: null,
};

export default TileContent;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/TileContent/index.js