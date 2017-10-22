import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import { get } from 'lodash/fp';
import { isMobileBreakpoint } from 'helpers/viewport';
import Link from 'components/Link';
import { deepDiveMetaDataShape, pickMetaDataShape } from '../../shapes';
import GridContainer from '../../GridContainer';
import PickNumber from '../../PickNumber';
import ItemInfoContainer from '../../../containers/ItemInfoContainer';
import { applyBackground, applyTextColor, applyTextShadow } from '../../../helpers/applyStyle';
import CSS from './style.scss';

const itemUrl = articleId => `/item/${articleId}`;

const containerStyle = metadata => ({
  ...applyBackground(get('background', metadata)),
});

const titleStyle = metadata => ({
  ...applyTextColor(get('title_text_color', metadata)),
  ...applyTextShadow({
    x: isMobileBreakpoint() ? '-2px' : '-3px',
    y: isMobileBreakpoint() ? '2px' : '3px',
    color: get('title_text_shadow', metadata),
  }),
});

const FullscreenPick = ({ number, deepDiveMetadata, metadata, image, articleId, title, intro }) => (
  <div className={CSS.pick} data-test-identifier="deep-dive-pick-fullscreen">
    <div className={CSS.numberContainer}>
      <PickNumber number={number} deepDiveMetadata={deepDiveMetadata} />
    </div>
    <div className={CSS.imageContainer}>
      <div className={CSS.imageBackground} style={containerStyle(metadata)} />
      <img src={image} alt="" className={CSS.image} />
    </div>
    <div className={CSS.contentContainer} style={containerStyle(metadata)}>
      <GridContainer>
        <h2 className={CSS.title} style={titleStyle(metadata)}>
          <Link className={CSS.link} href={itemUrl(articleId)}>
            {title}
          </Link>
        </h2>
        <div className={CSS.introWrapper}>
          <p className={CSS.intro} dangerouslySetInnerHTML={{ __html: intro }} />
        </div>
        <ItemInfoContainer itemId={articleId} />
      </GridContainer>
    </div>
  </div>
);

FullscreenPick.propTypes = {
  number: PropTypes.number.isRequired,
  metadata: pickMetaDataShape,
  articleId: PropTypes.string.isRequired,
  image: PropTypes.string,
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  deepDiveMetadata: deepDiveMetaDataShape,
};

export const FullscreenPickComponent = FullscreenPick;
export default pure(FullscreenPick);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/picks/FullscreenPick/index.js