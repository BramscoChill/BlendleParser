import React, { Component } from 'react';
import { arrayOf, string } from 'prop-types';
import altConnect from 'higher-order-components/altConnect';
import withRouter from 'react-router/lib/withRouter';
import { compose } from 'recompose';
import includeStoryDetails from 'modules/stories/higher-order-components/includeStoryDetails';
import redirectToStoredRoute from 'higher-order-components/redirectToStoredRoute';
import AuthStore from 'stores/AuthStore';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import { isActive } from 'selectors/subscriptions';
import { NEXT_SECTIONS_TO_LOAD_COUNT } from '../constants';
import PersonalPage from '../components/PersonalPage';
import { getTilesUrl } from '../selectors/sections';
import SectionsPageStore from '../stores/SectionsPageStore';
import SectionsPageActions from '../actions/SectionsPageActions';

class PersonalPageContainer extends Component {
  static propTypes = {
    sectionIds: arrayOf(string).isRequired,
  };

  state = {
    visibleSectionsCount: NEXT_SECTIONS_TO_LOAD_COUNT,
  };

  componentDidMount() {
    const userId = AuthStore.getState().user.id;
    SectionsPageActions.fetchPersonalPage.defer(userId);
    this.preloadNextSections();
  }

  componentWillUnmount() {
    window.cancelIdleCallback(this.preloadCallbackId);
    SectionsPageActions.resetScrollPosition();
  }

  preloadNextSections() {
    this.preloadCallbackId = window.requestIdleCallback(() => {
      const { visibleSectionsCount } = this.state;
      const { sectionIds, sections, sectionFeeds } = SectionsPageStore.getState();

      const sectionIdsToPreload = sectionIds.slice(
        visibleSectionsCount,
        visibleSectionsCount + NEXT_SECTIONS_TO_LOAD_COUNT,
      );

      sectionIdsToPreload
        .map(sectionId => sections.get(sectionId))
        .filter(section => !!section)
        .forEach((section) => {
          if (!sectionFeeds.get(section.id)) {
            SectionsPageActions.fetchSectionFeed(section.id, getTilesUrl(section));
          }
        });
    });
  }

  showMoreSections = () => {
    this.setState(currentState => ({
      visibleSectionsCount: currentState.visibleSectionsCount + NEXT_SECTIONS_TO_LOAD_COUNT,
    }));
    this.preloadNextSections();
  };

  render() {
    const { sectionIds, ...props } = this.props;

    return (
      <PersonalPage
        showMoreSections={this.showMoreSections}
        sectionIds={sectionIds.slice(0, this.state.visibleSectionsCount)}
        {...props}
      />
    );
  }
}

const mapStateToProps = (
  { sectionsPageState, moduleNavigationState, premiumSubscriptionState },
  { route },
) => {
  const { subscription } = premiumSubscriptionState;
  const { status, activeFeedbackItemId, sectionIds, scrollPosition } = sectionsPageState;
  const { activeModule } = moduleNavigationState;

  return {
    status,
    isActive: activeModule === route.module,
    showStories: Boolean(subscription && isActive(subscription)),
    activeFeedbackItemId,
    sectionIds,
    scrollPosition,
  };
};
mapStateToProps.stores = { SectionsPageStore, ModuleNavigationStore, PremiumSubscriptionStore };

const enhance = compose(
  redirectToStoredRoute,
  includeStoryDetails,
  withRouter,
  altConnect(mapStateToProps),
);

export default enhance(PersonalPageContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/containers/PersonalPageContainer.js