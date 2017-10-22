import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import { curry } from 'lodash/fp';
import classNames from 'classnames';
import NormalTileContainer from 'containers/NormalTileContainer';
import Link from 'components/Link';
import { deepDiveMetaDataShape } from '../../shapes';
import GridContainer from '../../GridContainer';
import PickNumber from '../../PickNumber';
import CSS from './style.scss';

const withAlignment = curry((index, baseClassNames) => {
  const isRight = index % 2 === 0;

  return classNames(baseClassNames, {
    [CSS.alignRight]: isRight,
  });
});

const itemUrl = articleId => `/item/${articleId}`;

const ManifestPick = ({ number, deepDiveMetadata, articleId, title, intro }) => {
  const aligned = withAlignment(number);

  return (
    <div className={CSS.pick} data-test-identifier="deep-dive-pick-tile">
      <GridContainer>
        <div className={CSS.numberContainer}>
          <PickNumber number={number} deepDiveMetadata={deepDiveMetadata} />
        </div>
        <div className={aligned(CSS.pickContent)}>
          <div className={aligned(CSS.textContainer)}>
            <div className={CSS.backgroundFade}>
              <h2 className={CSS.title}>{title}</h2>
              <p className={CSS.intro} dangerouslySetInnerHTML={{ __html: intro }} />
              <Link className={`btn ${CSS.button}`} href={itemUrl(articleId)}>
                Read this story
              </Link>
            </div>
          </div>
          <div className={aligned(CSS.manifest)}>
            <NormalTileContainer itemId={articleId} />
          </div>
        </div>
      </GridContainer>
    </div>
  );
};

ManifestPick.propTypes = {
  number: PropTypes.number.isRequired,
  articleId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  intro: PropTypes.string.isRequired,
  deepDiveMetadata: deepDiveMetaDataShape,
};

export const ManifestPickComponent = ManifestPick;
export default pure(ManifestPick);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/picks/ManifestPick/index.js