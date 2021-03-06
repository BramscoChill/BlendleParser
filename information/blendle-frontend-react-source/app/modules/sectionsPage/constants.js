export const TILE_SCROLL_WIDTH = 290; // TODO: Do not hardcode this
export const VERTICAL_TILE_ASPECT_RATIO = '1:1';
export const PINS_SECTION_ID = 'user_pin_tiles';

export const MAX_SECTION_WIDTH_PX = 1080;

export const TITLE_BREAK_SMALL_PX = 300;
export const TITLE_BREAK_MEDIUM_PX = 355;
export const TITLE_BREAK_LARGE_PX = 400;
export const TITLE_BREAK_EXTRA_LARGE_PX = 650;
export const TITLE_BREAK_FEATURED_PX = MAX_SECTION_WIDTH_PX + 1;

export const MAX_CHARACTERS_FOR_INTRO = 280;
export const MIN_CHARACTER_FOR_INTRO = 30;

export const CONTEXT_MENU_ACTION_UNFOLLOW_CHANNEL = 'CONTEXT_MENU_ACTION_UNFOLLOW_CHANNEL';
export const CONTEXT_MENU_ACTION_FOLLOW_CHANNEL = 'CONTEXT_MENU_ACTION_FOLLOW_CHANNEL';
export const CONTEXT_MENU_ACTION_UNFOLLOW_PROVIDER = 'CONTEXT_MENU_ACTION_UNFOLLOW_PROVIDER';
export const CONTEXT_MENU_ACTION_FOLLOW_PROVIDER = 'CONTEXT_MENU_ACTION_FOLLOW_PROVIDER';

export const PARALLAX_DISTANCE_PX = 75;

export const NEXT_SECTIONS_TO_LOAD_COUNT = 2;

export const DESKTOP_LAYOUT_GRID = 'grid';
export const DESKTOP_LAYOUT_HORIZONTAL = 'horizontal';
export const DESKTOP_LAYOUTS = [DESKTOP_LAYOUT_HORIZONTAL, DESKTOP_LAYOUT_GRID];

export const MOBILE_LAYOUT_SCROLLING = 'mobile_scrolling';
export const MOBILE_LAYOUT_WRAPPING = 'mobile_wrapping';
export const MOBILE_LAYOUTS = [MOBILE_LAYOUT_SCROLLING, MOBILE_LAYOUT_WRAPPING];

export const SECTION_TYPE_CHANNEL = 'channel';
export const SECTION_TYPE_PROVIDER = 'provider';
export const SECTION_TYPE_ENTITY = 'entity';
export const SECTION_TYPE_EDITORIAL = 'editorial';

export const SUPPORTED_SECTION_TYPES = [
  SECTION_TYPE_CHANNEL,
  SECTION_TYPE_PROVIDER,
  SECTION_TYPE_ENTITY,
  SECTION_TYPE_EDITORIAL,
];



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/constants.js