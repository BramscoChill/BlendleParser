import React, { PureComponent } from 'react';
import { arrayOf, object, func, instanceOf, number, bool, string } from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import withViewportSize from 'higher-order-components/withViewportSize';
import { memoize, last, isEqual } from 'lodash';
import { getVariantByIndex } from 'helpers/branding';
import { STORY_TILE_PLACEHOLDER_WIDTH } from '../../constants';
import { storyLabel, coverUrl, unreadCount, iconUrl, storyType } from '../../selectors/stories';
import EmptyStateContainer from '../../containers/EmptyStateContainer';
import StoriesSectionWrapper from '../StoriesSectionWrapper';
import StoryTileMotion from '../StoryTileMotion';
import StoryTile from '../StoryTile';
import CSS from './style.scss';

// Get a background gradient based on the index, but memoize based on the story id. This way the
// story keeps the same gradient when they are re-ordered
const backgroundGradient = memoize((storyId, index) => getVariantByIndex(index).background());

class StoriesSection extends PureComponent {
  static propTypes = {
    innerWidth: number.isRequired,
    stories: arrayOf(object),
    storiesOrder: arrayOf(string).isRequired,
    isHidden: bool,
    seenItems: instanceOf(Map),
    setTransitionOrigin: func.isRequired,
    detailsRoute: string.isRequired,
  };

  static defaultProps = {
    stories: [],
    isHidden: false,
    seenItems: null,
  };

  state = {
    storiesOrder: this.props.storiesOrder,
    isTransitioning: false,
    transitioningStoryId: null,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.storiesOrder.length === 0) {
      this.setState({
        storiesOrder: nextProps.storiesOrder,
      });
    } else if (!isEqual(this.props.storiesOrder, nextProps.storiesOrder)) {
      // If the order of the stories changes, wait a bit before animating the story
      // To the back of the stories overview

      clearTimeout(this.updateOrderTimeout);
      this.updateOrderTimeout = setTimeout(() => {
        this.setState({
          storiesOrder: nextProps.storiesOrder,
          isTransitioning: true,
        });
      }, 300);

      // Scale the item that will be moved to the back
      this.setState({
        transitioningStoryId: last(nextProps.storiesOrder),
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.updateOrderTimeout);
  }

  onMotionRest = () => {
    this.setState({
      transitioningStoryId: null,
    });
  };

  render() {
    const {
      stories,
      seenItems,
      isHidden,
      innerWidth,
      setTransitionOrigin,
      detailsRoute,
    } = this.props;
    const numberOfPlaceholders = Math.ceil(innerWidth / STORY_TILE_PLACEHOLDER_WIDTH);

    return (
      <ReactCSSTransitionGroup
        component="div"
        transitionLeaveTimeout={300}
        transitionEnter={false}
        transitionLeave
        transitionName={{
          leave: CSS.leave,
          leaveActive: CSS.leaveActive,
        }}
      >
        {!isHidden && (
          <StoriesSectionWrapper hasStories={stories.length > 0}>
            {stories.map((story, index) => {
              const orderIndex = this.state.storiesOrder.indexOf(story.id);
              const isTransitionTile = story.id === this.state.transitioningStoryId;

              return (
                <StoryTileMotion
                  onRest={isTransitionTile && this.state.isTransitioning ? this.onMotionRest : null}
                  orderIndex={orderIndex}
                  isTransitioning={isTransitionTile}
                  key={story.id}
                >
                  <StoryTile
                    key={`story-tile-${story.id}`}
                    index={orderIndex}
                    storyUrl={detailsRoute.replace(/:id/, story.id)}
                    labelContent={storyLabel(story)}
                    badgeContent={unreadCount(story, seenItems)}
                    coverUrl={coverUrl(story)}
                    iconUrl={iconUrl(story)}
                    type={storyType(story)}
                    backgroundGradient={backgroundGradient(story.id, index)}
                    setTransitionOrigin={setTransitionOrigin}
                    isTransitioning={isTransitionTile}
                  />
                </StoryTileMotion>
              );
            })}
            <EmptyStateContainer numberOfPlaceholders={numberOfPlaceholders} />
          </StoriesSectionWrapper>
        )}
      </ReactCSSTransitionGroup>
    );
  }
}

export const StoriesSectionComponent = StoriesSection;
export default withViewportSize({ debounce: 100 })(StoriesSection);



// WEBPACK FOOTER //
// ./src/js/app/modules/stories/components/StoriesSection/index.js