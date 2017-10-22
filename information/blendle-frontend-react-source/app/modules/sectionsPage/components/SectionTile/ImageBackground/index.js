import React from 'react';
import { string } from 'prop-types';
import { Parallax } from '@blendle/lego';
import Image from 'components/Image';
import classNames from 'classnames';
import { featuresPropType, parallaxScrolling, noHoverEffect } from '../features';
import { PARALLAX_DISTANCE_PX } from '../../../constants';
import CSS from './style.scss';

function ImageLayer({ backgroundImage, features }) {
  if (features.includes(parallaxScrolling)) {
    // Use a negative parallax distance to change the direction
    return (
      <Parallax distance={-PARALLAX_DISTANCE_PX} offset={PARALLAX_DISTANCE_PX}>
        <Image src={backgroundImage} className={CSS.image} alt="" animate />
      </Parallax>
    );
  }

  return <Image src={backgroundImage} className={CSS.image} alt="" animate />;
}

ImageLayer.propTypes = {
  backgroundImage: string.isRequired,
  features: featuresPropType,
};

ImageLayer.defaultProps = {
  features: [],
};

function ImageBackground({ backgroundImage, features }) {
  return (
    <div className={classNames(CSS.imageLayers, features.includes(noHoverEffect) && CSS.noHover)}>
      <ImageLayer backgroundImage={backgroundImage} features={features} />
    </div>
  );
}

ImageBackground.propTypes = {
  backgroundImage: string.isRequired,
  features: featuresPropType,
};

ImageBackground.defaultProps = {
  features: [],
};

export default ImageBackground;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/ImageBackground/index.js