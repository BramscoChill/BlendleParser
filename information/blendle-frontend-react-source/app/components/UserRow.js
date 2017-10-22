import React from 'react';
import PropTypes from 'prop-types';
import FollowButton from 'components/buttons/Follow';
import Link from 'components/Link';
import AvatarImage from 'components/AvatarImage';
import { includes } from 'lodash';
import { STAFFPICKS } from 'app-constants';
import { locale as i18n } from 'instances/i18n';
import classNames from 'classnames';

class UserRow extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    analytics: PropTypes.object.isRequired,
    onNavigate: PropTypes.func,
  };

  _renderReason = () => {
    if (this.props.user.get('reason') && i18n.whotofollow.reasons[this.props.user.get('reason')]) {
      const reasonToFollow = i18n.whotofollow.reasons[this.props.user.get('reason')];

      if (reasonToFollow) {
        return <p className="reason">{reasonToFollow}</p>;
      }
    }
  };

  _renderBio = () => {
    if (this.props.user.get('text')) {
      return <span className="bio">{this.props.user.get('text')}</span>;
    }
  };

  _renderInfo = () => {
    if (includes(STAFFPICKS, this.props.user.id)) {
      return (
        <div className="follow-info">
          <span className="info info-followers">{this.props.user.get('followers')}</span>
          <span className="info info-posts">{this.props.user.get('posts')}</span>
        </div>
      );
    }
  };

  render() {
    const userNameClassName = classNames({
      'user-name': true,
      'no-bio': !this.props.user.get('text'),
    });

    return (
      <li>
        <FollowButton user={this.props.user} analytics={this.props.analytics} size="small" />
        {this._renderReason()}
        <Link
          className="user-avatar"
          href={`/user/${this.props.user.id}`}
          onClick={this.props.onNavigate}
        >
          <AvatarImage src={this.props.user.getAvatarHref()} />
        </Link>
        <Link
          className={userNameClassName}
          href={`/user/${this.props.user.id}`}
          onClick={this.props.onNavigate}
        >
          {this.props.user.get('username')}
        </Link>
        {this._renderBio()}
        {this._renderInfo()}
      </li>
    );
  }
}

export default UserRow;



// WEBPACK FOOTER //
// ./src/js/app/components/UserRow.js