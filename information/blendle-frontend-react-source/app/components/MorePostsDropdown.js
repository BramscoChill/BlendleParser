import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PostsTooltipDropdown from 'components/PostsTooltipDropdown';

class MorePostsDropdown extends PureComponent {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    className: PropTypes.string,
  };

  render() {
    const className = classNames(
      { [this.props.className]: this.props.className },
      'v-more-posts-dropdown',
    );

    return (
      <PostsTooltipDropdown posts={this.props.posts} className={className}>
        &#43;{this.props.posts.length}
      </PostsTooltipDropdown>
    );
  }
}

export default MorePostsDropdown;



// WEBPACK FOOTER //
// ./src/js/app/components/MorePostsDropdown.js