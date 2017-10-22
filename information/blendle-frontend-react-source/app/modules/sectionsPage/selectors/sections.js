import { get } from 'lodash';

export const getTilesUrl = section => get(section, '_links[b:feed].href');

export const getSectionItemIds = (sectionsPageState, sectionId) => {
  const sectionFeed = sectionsPageState.sectionFeeds.get(sectionId);
  return get(sectionFeed, 'data', []);
};

/**
 * This functions returns a truthy value if a section is a featured section. This is only here to
 * make testing the FeaturedSection easier. The API should tell the client if a section is featured
 * or not.
 * @param  {String}  sectionId The ID of the section.
 * @return {Boolean}
 */
export const isFeaturedSection = (sectionId) => {
  const featuredSections = ['entity_blendle_exclusive'];

  return featuredSections.includes(sectionId);
};



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/selectors/sections.js