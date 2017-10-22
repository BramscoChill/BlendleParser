import React from 'react';
import { number, bool } from 'prop-types';
import classNames from 'classnames';
import { ANIMATION_DELAY_INTERVAL_MS } from '../../../constants';
import CSS from './style.scss';

function StoryTilePlaceholder({ hasTile, index, isDoneLoading }) {
  const classes = classNames(CSS.storyTilePlaceholder, {
    [CSS.swipeOut]: hasTile && isDoneLoading,
    [CSS.fadeOut]: !hasTile && isDoneLoading,
  });

  return (
    <div
      className={classes}
      style={{
        animationDelay: `${ANIMATION_DELAY_INTERVAL_MS * index}ms`,
      }}
    />
  );
}

StoryTilePlaceholder.propTypes = {
  index: number.isRequired,
  hasTile: bool,
  isDoneLoading: bool,
};

export default StoryTilePlaceholder;



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/components/LoadingPlaceholders/StoryTilePlaceholder/index.js