import React from 'react';
import { node, oneOfType, string, bool } from 'prop-types';
import classNames from 'classnames';
import AcquiredBackdrop from 'components/tiles/AcquiredBackdrop';
import ImageBackground from '../ImageBackground';
import ColorBackground from '../ColorBackground';
import { featuresPropType, sharpCorners } from '../features';
import CSS from './style.scss';

function TileWrapper({
  children,
  backgroundImage,
  backgroundColor,
  brandingPosition,
  isRead,
  features,
  foregroundColor,
}) {
  const contentClassNames = classNames(CSS.content, {
    [CSS.noBackground]: !backgroundImage,
    [CSS.noBorderRadius]: features.includes(sharpCorners),
  });

  return (
    <div className={CSS.wrapper}>
      {backgroundImage && <ImageBackground backgroundImage={backgroundImage} features={features} />}
      {!backgroundImage && (
        <ColorBackground
          backgroundColor={backgroundColor}
          position={brandingPosition}
          hideForeground={isRead}
        />
      )}
      {isRead && <AcquiredBackdrop innerColor={foregroundColor} />}
      <div className={contentClassNames}>{children}</div>
    </div>
  );
}

TileWrapper.propTypes = {
  children: node.isRequired,
  backgroundImage: oneOfType([string, null]),
  backgroundColor: string.isRequired,
  foregroundColor: string.isRequired,
  brandingPosition: string.isRequired,
  isRead: bool.isRequired,
  features: featuresPropType,
};

TileWrapper.defaultProps = {
  backgroundImage: null,
  features: [],
};

export default TileWrapper;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/TileWrapper/index.js