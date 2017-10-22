import React, { PureComponent } from 'react';
import altConnect from 'higher-order-components/altConnect';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import PropTypes from 'prop-types';
import { compose, branch, renderNothing } from 'recompose';
import { translate } from 'instances/i18n';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_ERROR, STAFFPICKS_CHANNELS } from 'app-constants';
import {
  SUPPORTED_SECTION_TYPES,
  SECTION_TYPE_CHANNEL,
  MOBILE_LAYOUT_SCROLLING,
  MOBILE_LAYOUT_WRAPPING,
  SECTION_TYPE_PROVIDER,
  SECTION_TYPE_ENTITY,
  SECTION_TYPE_EDITORIAL,
} from '../constants';
import PageSection from '../components/PageSection';
import FeaturedSectionHeader from '../components/FeaturedSectionHeader';
import SectionsPageActions from '../actions/SectionsPageActions';
import { getTilesUrl, getSectionItemIds, isFeaturedSection } from '../selectors/sections';
import SectionsPageStore from '../stores/SectionsPageStore';

class PremiumSectionContainer extends PureComponent {
  static propTypes = {
    sectionId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { sections, sectionFeeds } = SectionsPageStore.getState();
    const { sectionId } = this.props;
    const section = sections.get(sectionId);

    if (!sectionFeeds.get(sectionId)) {
      SectionsPageActions.fetchSectionFeed.defer(sectionId, getTilesUrl(section));
    }
  }

  render() {
    return <PageSection {...this.props} />;
  }
}

function getSubtitle(section) {
  const followingState = section.following ? 'following' : 'not_following';

  switch (section.type) {
    case SECTION_TYPE_EDITORIAL:
      return translate('sections.subtitle.staffpicks');
    case SECTION_TYPE_CHANNEL:
      if (STAFFPICKS_CHANNELS.includes(section.channel.id)) {
        return translate('sections.subtitle.staffpicks');
      }

      return translate(`sections.subtitle.entity_${followingState}`);
    case SECTION_TYPE_ENTITY:
      return translate(`sections.subtitle.entity_${followingState}`);
    case SECTION_TYPE_PROVIDER:
      return translate(`sections.subtitle.provider_${followingState}`);
    default:
      return translate(`sections.subtitle.entity_${followingState}`);
  }
}

const mapStateToProps = ({ sectionsPageState }, { sectionId }) => {
  const { sections, sectionFeeds } = sectionsPageState;
  const section = sections.get(sectionId);

  const visibleItemIds = getSectionItemIds(sectionsPageState, sectionId);

  const {
    scrolledTiles = 0,
    label: title,
    item_uids: itemIds = [],
    type: sectionType,
    following: isFollowing = true,
  } =
    section || {};

  if (!SUPPORTED_SECTION_TYPES.includes(sectionType)) {
    return { isHidden: true };
  }

  const { status = STATUS_INITIAL, nextUrl } = sectionFeeds.get(sectionId) || {};
  const isLoading = [STATUS_PENDING, STATUS_INITIAL].includes(status) || !visibleItemIds.length;

  return {
    itemIds: visibleItemIds,
    tilesCount: itemIds.length,
    sectionType,
    status,
    isLoading,
    nextUrl,
    sectionId,
    title,
    subtitle: getSubtitle(section),
    scrolledTiles,
    mobileLayout: isFollowing ? MOBILE_LAYOUT_WRAPPING : MOBILE_LAYOUT_SCROLLING,
    headerComponent: isFeaturedSection(sectionId) ? FeaturedSectionHeader : undefined,
  };
};

mapStateToProps.stores = { SectionsPageStore };

const enhance = compose(
  altConnect(mapStateToProps),
  renderNothingIfIsHidden,
  branch(({ status }) => status === STATUS_ERROR, renderNothing),
);

export default enhance(PremiumSectionContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/containers/PageSectionContainer.js