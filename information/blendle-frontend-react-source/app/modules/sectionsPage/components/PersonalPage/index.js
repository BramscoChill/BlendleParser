import React, { Component } from 'react';
import { string, arrayOf, node, func, bool, number } from 'prop-types';
import { compose } from 'recompose';
import withViewportSize from 'higher-order-components/withViewportSize';
import classNames from 'classnames';
import { STATUS_OK, STATUS_PENDING, STATUS_ERROR, VIEW_TIMELINE_DELAY } from 'app-constants';
import resetStyles from 'higher-order-components/resetStyles';
import LoadMoreTrigger from 'components/LoadMoreTrigger';
import StoriesSectionContainer from 'modules/stories/containers/StoriesSectionContainer';
import DelayedTrack from 'models/DelayedTrack';
import UpgradeBulletinContainer from 'modules/timeline/containers/UpgradeContainer';
import UpsellBanner from './UpsellBanner';
import SectionsLoader from './SectionsLoader';
import PersonalPageError from '../PersonalPageError';
import IntroContainer from '../../containers/IntroContainer';
import PageSectionContainer from '../../containers/PageSectionContainer';
import CSS from './style.scss';

function renderSectionsWithUpsellContainer(sectionIds) {
  return sectionIds.reduce((result, currentSectionId, index) => {
    result.push(<PageSectionContainer key={currentSectionId} sectionId={currentSectionId} />);

    if (index === 1) {
      result.push(<UpsellBanner key="personal-page-upsell-banner" />);
    }

    return result;
  }, []);
}

class PersonalPage extends Component {
  static propTypes = {
    isActive: bool.isRequired,
    isMobileViewport: bool.isRequired,
    showMoreSections: func.isRequired,
    showStories: bool.isRequired,
    overlay: node,
    sectionIds: arrayOf(string),
    scrollPosition: number,
  };

  static defaultProps = {
    isActive: false,
    overlay: null,
    sectionIds: [],
    scrollPosition: 0,
  };

  componentDidMount() {
    this.viewTimelineEvent = new DelayedTrack(
      'View Timeline',
      { internal_location: 'timeline/premium' },
      VIEW_TIMELINE_DELAY,
    );

    if (this.props.isActive) {
      this.viewTimelineEvent.startTimeout();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isActive && !this.props.isActive) {
      this.viewTimelineEvent.startTimeout();
    }
  }

  componentDidUpdate(prevProps) {
    // We need to wait for the sections page to become visible again (using the isActive props)
    if (!prevProps.isActive && this.props.isActive) {
      window.scrollTo(0, this.props.scrollPosition);
    }
  }

  componentWillUnmount() {
    this.viewTimelineEvent.cancelTimeout();
  }

  render() {
    const {
      sectionIds,
      showMoreSections,
      showStories,
      isActive,
      isMobileViewport,
      status,
      overlay,
    } = this.props;

    const isStoriesVisible = showStories && isMobileViewport;

    return (
      <div
        className={classNames(CSS.personalPage, !isActive && CSS.hidden)}
        data-test-identifier="personal-page"
      >
        {status === STATUS_ERROR && <PersonalPageError />}
        {isStoriesVisible && <StoriesSectionContainer detailsRoute="/home/story/:id" />}
        <UpgradeBulletinContainer />
        <IntroContainer />
        {renderSectionsWithUpsellContainer(sectionIds)}
        {status === STATUS_PENDING && <SectionsLoader sectionsCount={sectionIds.length} />}
        <LoadMoreTrigger
          className={CSS.loadMoreTrigger}
          isActive={status === STATUS_OK}
          onNearEnd={showMoreSections}
        />
        {overlay}
      </div>
    );
  }
}

const enhance = compose(resetStyles, withViewportSize({ debounce: 100 }));

export const PersonalPageComponent = PersonalPage;
export default enhance(PersonalPage);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/PersonalPage/index.js