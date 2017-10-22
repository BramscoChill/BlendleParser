import React from 'react';
import { node, func, number, bool } from 'prop-types';
import { Motion, spring } from 'react-motion';
import classNames from 'classnames';
import { STORY_TILE_SIZE } from '../../constants';
import CSS from './style.scss';

const springConfig = { stiffness: 300, damping: 20 };
const transitioningSpringConfig = { stiffness: 140, damping: 14, precision: 3.0 };
const storyWidth = STORY_TILE_SIZE.WIDTH + STORY_TILE_SIZE.SPACE_BETWEEN;

function StoryTileMotion({ children, onRest, isTransitioning, orderIndex }) {
  const style = {
    x: spring(orderIndex * storyWidth, isTransitioning ? transitioningSpringConfig : springConfig),
  };

  return (
    <Motion style={style} onRest={onRest}>
      {motion => (
        <div
          className={classNames(CSS.motionTile, isTransitioning && CSS.transitioning)}
          style={{
            transform: `translate3d(${motion.x}px, 0, 0)`,
          }}
        >
          {children}
        </div>
      )}
    </Motion>
  );
}

StoryTileMotion.propTypes = {
  orderIndex: number.isRequired,
  isTransitioning: bool,
  children: node,
  onRest: func,
};

StoryTileMotion.defaultProps = {
  isTransitioning: false,
  children: undefined,
  onRest: undefined,
};

export default StoryTileMotion;



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/components/StoryTileMotion/index.js