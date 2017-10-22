import React, { cloneElement } from 'react';
import { node, string } from 'prop-types';
import classNames from 'classnames';
import { breakSmall } from 'helpers/viewport';
import Measure from 'react-measure';
import {
  largePadding,
  mediumProviderLogo,
  sharpCorners,
  bottomLeftGradient,
  showIntroText,
  parallaxScrolling,
} from '../SectionTile/features';
import CSS from './style.scss';

const mobileFeatures = [mediumProviderLogo, bottomLeftGradient, showIntroText, sharpCorners];

const desktopFeatures = [
  largePadding,
  mediumProviderLogo,
  bottomLeftGradient,
  showIntroText,
  parallaxScrolling,
  sharpCorners,
];

function FeaturedSection({ children, className }) {
  return (
    <Measure>
      {({ width, height }) => {
        // We first need to render an empty section so we can measure how big it will be
        if (width === 0 || height === 0) {
          return <div className={classNames(CSS.featuredSection, className)} />;
        }

        // At this point, we know the size of a featured section, so we can determine the size for
        // smartcropping etc.
        const isMobile = width <= breakSmall;
        const tileWidth = width;
        const tileHeight = height;

        // We only render one tile in a featured section
        const firstChild = children && children[0];

        return (
          <div className={classNames(CSS.featuredSection, className)}>
            {firstChild &&
              cloneElement(firstChild, {
                tileWidth,
                tileHeight,
                features: isMobile ? mobileFeatures : desktopFeatures,
              })}
          </div>
        );
      }}
    </Measure>
  );
}

FeaturedSection.propTypes = {
  children: node.isRequired,
  className: string,
};

FeaturedSection.defaultProps = {
  className: '',
};

export default FeaturedSection;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/FeaturedSection/index.js