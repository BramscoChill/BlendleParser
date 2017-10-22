import React from 'react';
import { bool, node } from 'prop-types';
import classNames from 'classnames';
import { Rows } from '@blendle/lego';
import { featuresPropType, largePadding, bottomLeftGradient } from '../features';
import CSS from './style.scss';

function Body({ features, hasBackgroundImage, children }) {
  const bodyClasses = classNames(CSS.body, {
    [CSS.largePadding]: features.includes(largePadding),
    [CSS.bottomLeftGradient]: features.includes(bottomLeftGradient),
  });

  return (
    <div className={bodyClasses}>
      {hasBackgroundImage && <div className={CSS.overlayGradient} />}
      <Rows className={CSS.content}>{children}</Rows>
    </div>
  );
}

Body.propTypes = {
  features: featuresPropType.isRequired,
  hasBackgroundImage: bool.isRequired,
  children: node.isRequired,
};

export default Body;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/Body/index.js