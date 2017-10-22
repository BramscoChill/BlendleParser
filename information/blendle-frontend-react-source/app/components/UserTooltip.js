import { includes } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'components/Link';
import Translate from 'components/shared/Translate';
import FollowButton from 'components/buttons/Follow';
import Auth from 'controllers/auth';
import AvatarImage from 'components/AvatarImage';
import { STAFFPICKS } from 'app-constants';

export default class extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    analytics: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className={`v-user-tooltip user-id-${this.props.user.id}`}>
        <div className="hovercard-top">
          <AvatarImage src={this.props.user.getAvatarHref()} animate />
          <div className="gradient" />
          <h1 className="user-name">
            <Link href={`/user/${this.props.user.id}`}>{this.props.user.get('username')}</Link>
          </h1>
        </div>
        <div className="hovercard-bottom">
          {this._renderBio()}
          {this._renderUserInfo()}
          {this._renderFollowButton()}
        </div>
      </div>
    );
  }

  _renderBio = () => {
    const userBio = this.props.user.getBioHTML();
    if (!userBio) {
      return;
    }

    return <div className="bio" dangerouslySetInnerHTML={{ __html: userBio }} />;
  };

  _renderUserInfo = () => {
    if (includes(STAFFPICKS, this.props.user.id)) {
      return;
    }

    return (
      <div className="user-info">
        <div className="info-followers">
          <span className="user-info-amount">{this.props.user.getFormattedFollowers()}</span>
          <Translate find="user.captions.followers" className="user-info-title" />
        </div>
        <div className="info-posts">
          <span className="user-info-amount">{this.props.user.get('posts')}</span>
          <Translate find="user.captions.shared" className="user-info-title" />
        </div>
      </div>
    );
  };

  _renderFollowButton = () => {
    if (Auth.getId() === this.props.user.id || includes(STAFFPICKS, this.props.user.id)) {
      return;
    }

    return <FollowButton user={this.props.user} analytics={this.props.analytics} size="small" />;
  };
}



// WEBPACK FOOTER //
// ./src/js/app/components/UserTooltip.js