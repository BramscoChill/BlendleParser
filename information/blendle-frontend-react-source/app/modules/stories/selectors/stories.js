import { get, memoize } from 'lodash';
import { translate } from 'instances/i18n';
import { STORY_TYPE_TUTORIAL } from '../constants';
import { smartCropImage } from 'helpers/smartCrop';

export const storyById = (stories, storyId) => stories.get(storyId);

export const storyIndex = (storiesOrder, storyId) => storiesOrder.findIndex(id => id === storyId);

export const coverUrl = story => get(story, '_links[b:cover].href');

export const iconUrl = story => get(story, '_links[b:icon].href');

export const unreadCount = (story, seenItems) =>
  get(story, 'item_uids', []).filter(itemId => !seenItems.has(itemId)).length;

export const storyType = story => get(story, 'type');

export const storyLabel = (story) => {
  const type = storyType(story);
  const label = get(story, 'label');

  return type === STORY_TYPE_TUTORIAL ? translate(label) : label;
};

export const storyDetailsUrl = story => get(story, '_links[b:feed].href');

export const storyCardIndex = story => get(story, 'activeIndex', 0);

export const tileIdByIndex = (story, index) => get(story, ['tileIds', index]);

export const activeTileId = story => tileIdByIndex(story, storyCardIndex(story));

export const coverBySize = memoize((url, width, height) => {
  if (!url) {
    return null;
  }

  const smartCropUrl = smartCropImage(
    { href: url },
    {
      width,
      height,
      widthInterval: false,
      heightInterval: false,
    },
  );

  return smartCropUrl;
}, (url, width, height) => `${url}::${width}::${height}`);

export function storiesByIds(stories, storyIds) {
  return storyIds.map(storyId => stories.get(storyId));
}



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/selectors/stories.js