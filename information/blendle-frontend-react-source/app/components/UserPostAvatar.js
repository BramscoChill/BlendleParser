import Auth from 'controllers/auth';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AvatarImage from 'components/AvatarImage';
import UsernameTooltip from 'components/UsernameTooltip';

class UserPostAvatar extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    onSelect: PropTypes.func,
    active: PropTypes.bool,
    className: PropTypes.string,
  };

  _onClickAvatar = (e) => {
    // Only select posts that contain text
    if (!this.props.post.text || !this.props.onSelect) {
      return;
    }

    this.props.onSelect(e, this.props.post);
  };

  render() {
    const user = this.props.post.user;

    const className = classNames({
      [this.props.className]: this.props.className,
      'v-user-avatar': true,
      's-has-message': !!this.props.post.text,
      's-active': this.props.active,
    });

    return (
      <UsernameTooltip
        posts={[this.props.post]}
        username={user.full_name}
        disabled={this.props.active}
        className={className}
      >
        <div onClick={this._onClickAvatar}>
          <AvatarImage
            src={user.avatar.href}
            className={user.uid === Auth.getId() ? 'is-me' : ''}
          />
        </div>
      </UsernameTooltip>
    );
  }
}

export default UserPostAvatar;



// WEBPACK FOOTER //
// ./src/js/app/components/UserPostAvatar.js