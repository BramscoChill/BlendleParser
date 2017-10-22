/* eslint-disable react/prop-types */
// Disable proptypes because it's a false positive since recompose is used

import React from 'react';
import { string, number, func, oneOf, bool } from 'prop-types';
import classNames from 'classnames';
import { CheckIcon } from '@blendle/lego';
import { compose, onlyUpdateForPropTypes, setPropTypes, withHandlers } from 'recompose';
import { memoize, capitalize } from 'lodash';
import { smartCropImage } from 'helpers/smartCrop';
import Link from 'components/Link';
import {
  ANIMATION_DELAY_INTERVAL_MS,
  STORY_TYPES,
  STORY_TYPE_PROVIDER,
  STORY_TILE_SIZE,
} from '../../constants';
import CSS from './style.scss';

const enhance = compose(
  onlyUpdateForPropTypes,
  setPropTypes({
    storyUrl: string,
    labelContent: string,
    iconUrl: string,
    coverUrl: string,
    isTransitioning: bool,
    backgroundGradient: string,
    badgeContent: number,
    type: oneOf(STORY_TYPES),
    setTransitionOrigin: func.isRequired,
  }),
  withHandlers({
    onClick: ({ setTransitionOrigin }) => (event) => {
      const targetRect = event.target.getBoundingClientRect();

      // ignore prettier because it tries to remove the parenthesis below
      // prettier-ignore
      setTransitionOrigin({
        xPos: targetRect.left + (targetRect.width / 2),
        yPos: targetRect.top + (targetRect.height / 2),
      });
    },
  }),
);

const getBackgroundImageUrl = memoize((url, storyType) => {
  // Provider stories have article images as background and should be cropped.
  if (storyType === STORY_TYPE_PROVIDER) {
    return smartCropImage(
      { href: url },
      {
        width: STORY_TILE_SIZE.WIDTH,
        height: STORY_TILE_SIZE.HEIGHT,
        widthInterval: false,
        heightInterval: false,
      },
    );
  }

  return url;
});

function StoryTile({
  storyUrl,
  index,
  labelContent,
  coverUrl,
  type,
  iconUrl,
  backgroundGradient,
  badgeContent,
  isTransitioning,
  onClick,
}) {
  const isCompleted = badgeContent === 0;

  const showBackground = !!coverUrl;
  const showIcon = !!iconUrl;

  const imageContainerStyle = showBackground
    ? { backgroundImage: `url(${getBackgroundImageUrl(coverUrl, type)})` }
    : { background: backgroundGradient };

  const animationDelay = `${index * ANIMATION_DELAY_INTERVAL_MS}ms`;
  const className = classNames(CSS.storyTile, CSS[`story${capitalize(type)}`], {
    [CSS.completed]: isCompleted,
    [CSS.transitioning]: isTransitioning,
  });

  return (
    <Link
      href={storyUrl}
      className={className}
      onClick={onClick}
      style={{
        animationDelay,
      }}
      analytics={{
        badge_value: badgeContent,
      }}
      data-test-identifier={`story-tile-${type}`}
    >
      <div className={CSS.container}>
        {!isCompleted && <span className={CSS.badge}>{badgeContent}</span>}
        <div
          className={classNames(CSS.imageContainer, isCompleted && CSS.completed)}
          style={imageContainerStyle}
        >
          {showIcon && <img src={iconUrl} className={CSS.icon} alt="" />}
        </div>
      </div>
      <div className={CSS.label}>{labelContent}</div>
    </Link>
  );
}

export const StoryTileComponent = StoryTile;
export default enhance(StoryTile);



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/components/StoryTile/index.js