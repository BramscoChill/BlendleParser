import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PostFacePile from 'components/PostFacePile';
import PostChannelBadges from 'components/PostChannelBadges';
import MiniPost from 'components/MiniPost';
import RecommendCount from 'components/RecommendCount';
import ActiveItemLine from 'components/ActiveItemLine';

class Toast extends PureComponent {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    channelPosts: PropTypes.array.isRequired,
    postCount: PropTypes.number.isRequired,
    activePost: PropTypes.object,
    onActivePostChange: PropTypes.func.isRequired,
  };

  _renderChannelBadges() {
    const { channelPosts, onActivePostChange, activePost } = this.props;

    if (channelPosts.length === 0) {
      return null;
    }

    return (
      <PostChannelBadges
        activePost={activePost}
        posts={channelPosts.slice(0, 2)}
        onSelect={onActivePostChange}
        limit={18}
      />
    );
  }

  _renderFaces() {
    const { posts, channelPosts, onActivePostChange, activePost } = this.props;
    const amount = channelPosts.length === 0 ? 4 : 1;

    if (posts.length === 0) {
      return null;
    }

    return (
      <PostFacePile
        activePost={activePost}
        posts={posts}
        onSelect={onActivePostChange}
        amount={amount}
      />
    );
  }

  _renderPost() {
    const { activePost } = this.props;

    if (!activePost) {
      return null;
    }

    return <MiniPost post={activePost} />;
  }

  render() {
    return (
      <div className="v-toast" ref="toast">
        <div className="v-shared-by">
          {this._renderChannelBadges()}
          {this._renderFaces()}
          <ActiveItemLine target={this} />
        </div>
        <RecommendCount amount={this.props.postCount} />
        {this._renderPost()}
      </div>
    );
  }
}

export default Toast;



// WEBPACK FOOTER //
// ./src/js/app/components/Toast.js