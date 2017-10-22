import alt from 'instances/altInstance';
import { getItemId } from 'selectors/item';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK, STATUS_ERROR } from 'app-constants';
import SectionsPageActions from '../actions/SectionsPageActions';

class SectionsPageStore {
  state = {
    status: STATUS_INITIAL,
    activeFeedbackItemId: null,
    removedItemIds: [],
    scrollPosition: 0,
    sections: new Map(),
    sectionFeeds: new Map(),
    sectionIds: [],
    intro: null,
  };

  constructor() {
    this.bindActions(SectionsPageActions);
  }

  onSetHidden(scrollPosition) {
    this.setState({
      scrollPosition,
    });
  }

  onResetScrollPosition() {
    this.setState({ scrollPosition: 0 });
  }

  onOpenItemFeedback(activeFeedbackItemId) {
    this.setState({ activeFeedbackItemId });
  }

  onCloseItemFeedback() {
    this.setState({
      activeFeedbackItemId: null,
    });
  }

  onRemoveItem(itemId) {
    this.setState({
      removedItemIds: [...this.state.removedItemIds, itemId],
      activeFeedbackItemId: null,
    });
  }

  onFetchPersonalPage() {
    this.setState({
      status: STATUS_PENDING,
    });
  }

  onFetchPersonalPageSuccess({ sections: fetchedSections, intro }) {
    const sections = new Map(...this.state.sections);
    const sectionIds = [];

    fetchedSections.forEach((section) => {
      sectionIds.push(section.id);
      const currentSection = sections.get(section.id);

      sections.set(section.id, {
        ...currentSection,
        ...section,
      });
    });

    this.setState({
      sections,
      sectionIds,
      status: STATUS_OK,
      intro,
    });
  }

  onFetchPersonalPageError({ error }) {
    this.setState({
      status: STATUS_ERROR,
      error,
    });
  }

  onFetchSectionFeed({ sectionId }) {
    const sectionFeeds = new Map(...this.state.sectionFeeds);

    sectionFeeds.set(sectionId, {
      status: STATUS_PENDING,
      data: [],
    });

    this.setState({
      sectionFeeds,
    });
  }

  onFetchSectionFeedSuccess({ sectionId, tiles, nextUrl }) {
    const sectionFeeds = new Map(...this.state.sectionFeeds);

    sectionFeeds.set(sectionId, {
      status: STATUS_OK,
      data: tiles.map(getItemId),
      nextUrl,
    });

    this.setState({
      sectionFeeds,
    });
  }

  onFetchSectionFeedError({ sectionId, error }) {
    const sectionFeeds = new Map(...this.state.sectionFeeds);

    sectionFeeds.set(sectionId, {
      status: STATUS_ERROR,
      error,
    });

    this.setState({
      sectionFeeds,
    });
  }
}

export default alt.createStore(SectionsPageStore, 'SectionsPageStore');



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/stores/SectionsPageStore.js