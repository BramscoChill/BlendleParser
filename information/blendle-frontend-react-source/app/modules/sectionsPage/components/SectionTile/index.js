import React from 'react';
import { string, number, bool, func, arrayOf, shape } from 'prop-types';
import {
  compose,
  onlyUpdateForPropTypes,
  withHandlers,
  setPropTypes,
  setDisplayName,
} from 'recompose';
import striptags from 'striptags';
import classNames from 'classnames';
import Link from 'components/Link';
import { translate } from 'instances/i18n';
import { MAX_CHARACTERS_FOR_INTRO, MIN_CHARACTER_FOR_INTRO } from '../../constants';
import TileHead from './TileHead';
import Title from './Title';
import Intro from './Intro';
import Body from './Body';
import TileWrapper from './TileWrapper';
import ReadingTime from './ReadingTime';
import TileContent from './TileContent';
import { featuresPropType, sharpCorners, showIntroText } from './features';
import CSS from './style.scss';

function shouldShowIntro(tileFeatures, title, intro) {
  return intro && tileFeatures.includes(showIntroText)
    ? title.length + intro.length <= MAX_CHARACTERS_FOR_INTRO
    : // If a title is very short, make sure to show an intro
      title.length <= MIN_CHARACTER_FOR_INTRO;
}

const enhance = compose(
  onlyUpdateForPropTypes,
  setPropTypes({
    setPinState: func.isRequired,
    providerId: string.isRequired,
    title: string.isRequired,
    intro: string,
    postCount: number.isRequired,
    isPinned: bool.isRequired,
    itemUrl: string.isRequired,
    readingTime: number.isRequired,
    backgroundImage: string,
    backgroundImageCredits: string,
    brandingBackgroundColor: string,
    brandingForegroundColor: string,
    brandingPosition: string,
    isRead: bool.isRequired,
    avatars: arrayOf(string).isRequired,
    shouldShowPostCount: bool.isRequired,
    tileWidth: number.isRequired,
    features: featuresPropType,
    analytics: shape({
      internal_location: string.isRequired,
      position: number.isRequired,
      section_id: string.isRequired,
      section_type: string.isRequired,
      grid: shape({
        rows: number.isRequired,
        columns: number.isRequired,
        template: string.isRequired,
      }),
    }).isRequired,
  }),
  withHandlers({
    onClickReadLater: ({ setPinState, itemId, isPinned, analytics }) => (e) => {
      e.preventDefault();
      setPinState(itemId, !isPinned, analytics);
    },
  }),
  setDisplayName('SectionTile'),
);

const SectionTile = enhance(
  ({
    itemId,
    providerId,
    title,
    intro,
    isPinned,
    itemUrl,
    backgroundImage,
    backgroundImageCredits,
    brandingBackgroundColor,
    brandingForegroundColor,
    brandingPosition,
    isRead,
    readingTime,
    onClickReadLater,
    postCount,
    shouldShowPostCount,
    avatars,
    tileWidth,
    features,
    analytics,
  }) => (
    <Link
      data-test-identifier="section-tile"
      className={classNames(CSS.sectionTile, features.includes(sharpCorners) && CSS.noBorderRadius)}
      analytics={analytics}
      href={`/${itemUrl}`}
    >
      <TileWrapper
        backgroundImage={backgroundImage}
        backgroundColor={brandingBackgroundColor}
        foregroundColor={brandingForegroundColor}
        brandingPosition={brandingPosition}
        isRead={isRead}
        features={features}
      >
        <TileHead
          itemId={itemId}
          tileWidth={tileWidth}
          providerId={providerId}
          hasBackgroundImage={!!backgroundImage}
          shouldShowShareCount={shouldShowPostCount}
          shareCount={postCount}
          avatars={avatars}
          onClickReadLater={onClickReadLater}
          isPinned={isPinned}
          features={features}
          analytics={analytics}
        />
        <Body hasBackgroundImage={!!backgroundImage} features={features}>
          <TileContent features={features}>
            <ReadingTime hasBackgroundImage={!!backgroundImage}>
              {translate('timeline.tiles.minutes_reading', { minutes: readingTime })}
            </ReadingTime>
            <Title tileWidth={tileWidth} hasBackgroundImage={!!backgroundImage}>
              {title}
            </Title>
            {shouldShowIntro(features, title, intro) && (
              <Intro tileWidth={tileWidth}>{striptags(intro)}</Intro>
            )}
          </TileContent>
          {backgroundImageCredits && (
            <span className={CSS.imageCredits}>{backgroundImageCredits}</span>
          )}
        </Body>
      </TileWrapper>
    </Link>
  ),
);

export default SectionTile;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionTile/index.js