import alt from 'instances/altInstance';
import { get } from 'lodash';
import { XHR_STATUS } from 'app-constants';
import { SUPPORTED_SECTION_TYPES } from '../constants';
import { fetchPersonalPage, fetchTiles } from '../managers/sectionsPageManager';

class SectionsPageActions {
  setHidden = scrollPosition => scrollPosition;

  resetScrollPosition = () => null;

  openItemFeedback = itemId => itemId;
  closeItemFeedback = () => null;

  removeItem = itemId => itemId;

  fetchPersonalPage(userId) {
    fetchPersonalPage(userId).then(
      response =>
        this.fetchPersonalPageSuccess({
          sections: response._embedded['b:sections'].filter(section =>
            SUPPORTED_SECTION_TYPES.includes(section.type),
          ),
          intro: response._embedded['b:intro'],
        }),
      (error) => {
        this.fetchPersonalPageError(error);

        if (error.type !== XHR_STATUS) {
          throw error;
        }
      },
    );

    return null;
  }

  fetchPersonalPageSuccess = sections => sections;
  fetchPersonalPageError = error => error;

  fetchSectionFeed(sectionId, url) {
    fetchTiles(url).then(
      (response) => {
        const tiles = get(response, '_embedded[b:tiles]');
        if (!tiles) {
          this.fetchSectionFeedError({ error: new Error('response did contain tiles'), sectionId });
        }

        this.fetchSectionFeedSuccess({
          sectionId,
          tiles,
          nextUrl: get(response, '_links.next.href'),
        });
      },
      (error) => {
        this.fetchSectionFeedError({ error, sectionId });

        if (error.type !== XHR_STATUS) {
          throw error;
        }
      },
    );

    return { sectionId };
  }

  fetchSectionFeedSuccess = ({ sectionId, tiles }) => ({ sectionId, tiles });
  fetchSectionFeedError = error => error;
}

export default alt.createActions(SectionsPageActions);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/actions/SectionsPageActions.js