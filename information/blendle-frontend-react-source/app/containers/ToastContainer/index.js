import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import Toast from 'components/Toast';
import TilesStore from 'stores/TilesStore';
import TimelineStore from 'stores/TimelineStore';
import { getPostCount, getPosts, getChannelPosts } from 'selectors/tiles';
import { sortBy } from 'lodash';

class ToastContainer extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
    headlineToastEnabled: PropTypes.bool,
    itemReasonDisabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      activePost: null,
    };
  }

  _onActivePostChange = (e, post) => {
    e.preventDefault();

    this.setState({
      activePost: post,
    });
  };

  _renderToast = ({ tilesState, timelineState }) => {
    const { itemId } = this.props;
    const posts = getPosts(tilesState.tiles, itemId);
    const channelPosts = getChannelPosts(tilesState.tiles, itemId);
    const postCount = getPostCount(tilesState.tiles, itemId);
    const { activeTimelineKey, timelines } = timelineState;
    const activeTimeline = timelines.get(activeTimelineKey);
    const activeChannel = activeTimeline.options.details;
    const sortedChannelPosts = sortBy(channelPosts, post => post.channel_uid !== activeChannel);
    const activePost =
      this.state.activePost ||
      sortedChannelPosts.find(post => !!post.text) ||
      posts.find(post => !!post.text);

    return (
      <div className="post-container">
        <Toast
          postCount={postCount}
          posts={posts}
          channelPosts={sortedChannelPosts}
          onActivePostChange={this._onActivePostChange}
          activePost={activePost}
        />
      </div>
    );
  };

  render() {
    return (
      <AltContainer
        stores={{ tilesState: TilesStore, timelineState: TimelineStore }}
        render={this._renderToast}
      />
    );
  }
}

export default ToastContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/ToastContainer/index.js