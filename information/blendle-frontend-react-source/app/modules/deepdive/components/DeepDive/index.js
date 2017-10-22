import React, { PropTypes } from 'react';
import { pure } from 'recompose';
import { picks, readMoreTitle, readMorePicks } from 'selectors/deepDives';
import Header from '../Header';
import Title from '../Title';
import Intro from '../Intro';
import ManifestPick from '../picks/ManifestPick';
import FullscreenPick from '../picks/FullscreenPick';
import ReadMore from '../ReadMore';
import SharingContainer from '../../containers/SharingContainer';
import CSS from './style.scss';

const renderPick = deepDiveMetadata => (pick, index) => {
  const typesMap = {
    fullscreen: FullscreenPick,
    default: ManifestPick,
  };

  const PickComponent = typesMap[pick.type] || typesMap.default;

  return (
    <PickComponent
      key={`pick-${pick.article_id}`}
      number={index + 1}
      metadata={pick.metadata}
      articleId={pick.article_id}
      image={pick.image}
      title={pick.title}
      intro={pick.intro}
      deepDiveMetadata={deepDiveMetadata}
    />
  );
};

const DeepDive = ({ isLoading, deepDive }) => {
  if (isLoading) {
    return null;
  }

  return (
    <div className={CSS.deepDive} data-test-identifier="deep-dive-page">
      <Header metadata={deepDive.metadata}>
        <Title metadata={deepDive.metadata}>{deepDive.title}</Title>
        <Intro metadata={deepDive.metadata}>{deepDive.intro}</Intro>
      </Header>
      <div className={CSS.timelineContainer}>
        <div className={CSS.timeline} />
        <div className={CSS.picks}>{picks(deepDive).map(renderPick(deepDive.metadata))}</div>
      </div>
      <ReadMore title={readMoreTitle(deepDive)} picks={readMorePicks(deepDive)} />
      <SharingContainer deepDive={deepDive} />
    </div>
  );
};

DeepDive.propTypes = {
  deepDive: PropTypes.object,
  isLoading: PropTypes.bool,
};

export const DeepDiveComponent = DeepDive;
export default pure(DeepDive);



// WEBPACK FOOTER //
// ./src/js/app/modules/deepdive/components/DeepDive/index.js