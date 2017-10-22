import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class PostChannelBadge extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    active: PropTypes.bool,
  };

  _onClickBadge = (e) => {
    // Only select posts that contain text
    if (!this.props.post.text) {
      return;
    }

    this.props.onSelect(e, this.props.post);
  };

  render() {
    const linkClassName = classNames('channel', `channel-${this.props.post.channel_uid}`, {
      's-active': this.props.active,
    });

    return (
      <div className="v-channel-badge">
        <div className={linkClassName} onClick={this._onClickBadge}>
          {this.props.post.channel_name}
        </div>
      </div>
    );
  }
}

export default PostChannelBadge;



// WEBPACK FOOTER //
// ./src/js/app/components/PostChannelBadge.js