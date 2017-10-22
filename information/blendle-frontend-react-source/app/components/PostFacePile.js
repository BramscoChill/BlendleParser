import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UserPostAvatar from 'components/UserPostAvatar';
import MorePostsDropdown from 'components/MorePostsDropdown';

class PostFacePile extends PureComponent {
  static propTypes = {
    onSelect: PropTypes.func,
    amount: PropTypes.number,
    activePost: PropTypes.object,
    posts: PropTypes.array.isRequired,
  };

  static defaultProps = {
    onSelect: () => {},
  };

  _renderFaces() {
    const { posts, amount, onSelect, activePost } = this.props;

    // Prevent rendering of [+1] dropdown
    const limit = posts.length <= amount + 1 ? amount + 1 : amount;

    return posts
      .slice(0, limit)
      .map(post => (
        <UserPostAvatar
          post={post}
          key={`${post.created_at}-${post.user.uid}`}
          active={post === activePost}
          onSelect={onSelect}
        />
      ));
  }

  _renderMoreDropdown() {
    const { amount, posts } = this.props;

    // If only 1 left then render the avatar, don't render a dropdown
    if (posts.length > amount + 1) {
      return <MorePostsDropdown posts={posts.slice(amount)} />;
    }

    return null;
  }

  render() {
    return (
      <div className="v-facepile">
        {this._renderFaces()}
        {this._renderMoreDropdown()}
      </div>
    );
  }
}

export default PostFacePile;



// WEBPACK FOOTER //
// ./src/js/app/components/PostFacePile.js