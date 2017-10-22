import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PostChannelBadge from 'components/PostChannelBadge';

class PostChannelBadges extends PureComponent {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    limit: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    activePost: PropTypes.object,
  };

  static defaultProps = {
    limit: 0,
  };

  _renderBadges() {
    let totalCharacters = 0;

    return this.props.posts
      .filter((post) => {
        totalCharacters += post.channel_name.length;
        return totalCharacters < this.props.limit;
      })
      .map(post => (
        <PostChannelBadge
          active={this.props.activePost === post}
          post={post}
          key={`${post.created_at}-${post.user.uid}`}
          onSelect={this.props.onSelect}
        />
      ));
  }

  render() {
    return <div className="v-channel-badges">{this._renderBadges()}</div>;
  }
}

export default PostChannelBadges;



// WEBPACK FOOTER //
// ./src/js/app/components/PostChannelBadges.js