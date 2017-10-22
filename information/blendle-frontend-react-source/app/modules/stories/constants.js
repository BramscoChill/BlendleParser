export const ANIMATION_DELAY_INTERVAL_MS = 100;

export const SWIPE_THRESHOLD_PX = 70;
export const SPRING_SETTING = { stiffness: 170, damping: 20, precision: 2.0 };

export const GESTURE_PREV = 'GESTURE_PREV';
export const GESTURE_NEXT = 'GESTURE_NEXT';
export const GESTURE_OPEN_READER = 'GESTURE_OPEN_READER';
export const GESTURE_CLOSE_STORY = 'GESTURE_CLOSE_STORY';
export const HORIZONTAL_GESTURES = [GESTURE_PREV, GESTURE_NEXT];

export const TRANSITION_STATE_OPENING = 'opening';
export const TRANSITION_STATE_OPEN = 'opened';
export const TRANSITION_STATE_CLOSING = 'closing';

export const TUTORIAL_STORY_ID = 'tutorial';

export const STORY_CARD_TYPE_TILE = 'STORY_CARD_TILE';
export const STORY_CARD_TYPE_TUTORIAL = 'STORY_CARD_TUTORIAL';
export const STORY_CARD_TYPES = [STORY_CARD_TYPE_TILE, STORY_CARD_TYPE_TUTORIAL];

export const TUTORIAL_OVERLAY_VISIBLE_KEY = 'STORIES_TUTORIAL_VISIBLE';
export const TUTORIAL_COMPLETED_DAY_KEY = 'STORIES_TUTORIAL_COMPLETED_DAY_KEY';

export const STORY_TYPE_PROVIDER = 'provider';
export const STORY_TYPE_CHANNEL = 'channel';
export const STORY_TYPE_TUTORIAL = 'tutorial';
export const STORY_TYPES = [STORY_TYPE_PROVIDER, STORY_TYPE_CHANNEL, STORY_TYPE_TUTORIAL];

export const STORY_TILE_SIZE = {
  // This values are used for smart crop only.
  // If you change this, you also need to change some CSS
  WIDTH: 60,
  HEIGHT: 60,
  SPACE_BETWEEN: 10,
};
export const STORY_TILE_PLACEHOLDER_WIDTH = STORY_TILE_SIZE.WIDTH + STORY_TILE_SIZE.SPACE_BETWEEN;



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/constants.js