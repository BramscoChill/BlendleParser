import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'instances/i18n';
import Analytics from 'instances/analytics';
import Auth from 'controllers/auth';
import AvatarImage from 'components/AvatarImage';
import User from 'components/User';
import FollowButton from 'components/buttons/Follow';
import BrowserEnvironment from 'instances/browser_environment';
import { DEFAULT_AVATAR, STAFFPICKS } from 'app-constants';

const dummy = document.createElement('div');
const CSSMaskSupport =
  dummy.style['mask-size'] !== undefined || dummy.style['-webkit-mask-size'] !== undefined;

export default class ProfileTile extends React.Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
  };

  _onClickFollowers() {
    Analytics.track('View Followers', this._getAnalytics());
  }

  _onClickFollowing() {
    Analytics.track('View Following', this._getAnalytics());
  }

  _onClickItems() {
    Analytics.track('View Bought', this._getAnalytics());
  }

  _getAnalytics() {
    return {
      type: 'profile',
      user_id: this.props.profile.id,
    };
  }

  _renderManagers() {
    const managers = this.props.profile.getEmbedded('managers');

    if (!managers || !managers.length) {
      return null;
    }

    const list = managers
      .filter(manager => !manager.get('manager_hidden'))
      .map((manager, i, array) => {
        // human string concatination
        let divider = ', ';
        if (i === array.length - 2 && array.length !== 1) {
          divider = ` ${translate('user.and')} `;
        } else if (i === array.length - 1) {
          divider = '.';
        }
        return (
          <span key={manager.id}>
            <User user={manager} analytics={this._getAnalytics()} />
            {divider}
          </span>
        );
      });

    return (
      <div className="curators">
        {translate('user.curated_by')}&nbsp;{list}
      </div>
    );
  }

  _renderChannels() {
    const channels = this.props.profile.getEmbedded('shared_users');

    if (!channels || !channels.length) {
      return null;
    }

    // Remove hidden channels
    const curatedChannels = channels
      .filter(channel => !channel.get('shared_user_hidden'))
      .map((channel, i, array) => {
        let divider = ' ';

        if (BrowserEnvironment.isMobile()) {
          if (i === array.length - 2 && array.length !== 1) {
            divider = ` ${translate('user.and')} `;
          } else if (i < array.length - 2 && array.length !== 1) {
            divider = ', ';
          }
        }

        return (
          <span key={channel.id}>
            <a href={`/channel/${channel.id}`} className={`channel channel-${channel.id}`}>
              {channel.get('username')}
            </a>
            {divider}
          </span>
        );
      });

    // If all channels are hidden, don't show the 'curates for' element
    if (!curatedChannels.length) {
      return null;
    }

    return (
      <div className="curates-for">
        {translate('user.curates_for')}&nbsp;{curatedChannels}
      </div>
    );
  }

  _renderSuperCircleAvatar() {
    const url = this.props.profile.getAvatarHref() || DEFAULT_AVATAR;

    const avatarStyle = {
      background: `url(${url}) 50% 50%`,
      backgroundSize: 'cover',
    };

    // The img element is not visible, but this was users can save the avatar like it is a normal
    // image instead of a background image
    return <div className="supercircle-user-avatar" style={avatarStyle} />;
  }

  _renderAvatar() {
    if (this.props.profile.isChannel) {
      return null;
    }

    // Backwards compatibilty
    if (CSSMaskSupport) {
      return this._renderSuperCircleAvatar();
    }

    return (
      <div className="user-avatar">
        <AvatarImage src={this.props.profile.getAvatarHref()} />
      </div>
    );
  }

  _renderFollowButtonOrReads() {
    const profile = this.props.profile;
    if (profile.id === 'blendle') {
      return;
    }
    if (Auth.getId() !== profile.id) {
      return (
        <div className="lnk button-area">
          <div className="button-holder">
            <FollowButton user={profile} isProfile analytics={this._getAnalytics()} />
          </div>
        </div>
      );
    }

    const itemsUrl = `/${profile.isChannel ? 'channel' : 'user'}/${profile.id}/items`;
    return (
      <a
        href={itemsUrl}
        title={`${translate('user.labels.items')} (${profile.get('reads')})`}
        onClick={this._onClickItems.bind(this)}
        className="lnk lnk-items"
      >
        <span className="amount">{profile.getFormattedReads()}</span>
        <span className="caption">{translate('user.captions.read')}</span>
      </a>
    );
  }

  _renderFollowers() {
    const profile = this.props.profile;

    // hide the followers count at the staffpicks, so journalists can't find out how much users we have
    if (Object.values(STAFFPICKS).includes(profile.id)) {
      return;
    }

    const followersUrl = `/${profile.isChannel ? 'channel' : 'user'}/${profile.id}/followers`;
    return (
      <a
        className="lnk lnk-followers"
        onClick={this._onClickFollowers.bind(this)}
        href={followersUrl}
        title={translate('user.captions.followers')}
      >
        <span className="amount">{profile.getFormattedFollowers()}</span>
        <span className="caption">{translate('user.captions.followers')}</span>
      </a>
    );
  }

  _renderFollowingButton() {
    const profile = this.props.profile;
    if (profile.isChannel) {
      return;
    }
    const followingUrl = `/${profile.isChannel ? 'channel' : 'user'}/${profile.id}/following`;
    return (
      <a
        href={followingUrl}
        title={translate('user.labels.following')}
        className="lnk lnk-following"
        onClick={this._onClickFollowing.bind(this)}
      >
        <span className="amount">{profile.getFormattedFollowing()}</span>
        <span className="caption">{translate('user.captions.following')}</span>
      </a>
    );
  }

  _renderBio() {
    if (!this.props.profile.get('text')) {
      return;
    }
    return (
      <p
        className="user-description"
        dangerouslySetInnerHTML={{ __html: this.props.profile.getBioHTML() }}
      />
    );
  }

  render() {
    const profile = this.props.profile;

    const containerClassName = classNames({
      'v-tile': true,
      'v-profile-tile': true,
      'tile-profile': true,
      's-success': true,
      'channel-profile': profile.isChannel,
      [`user-id-${profile.id}`]: true,
    });

    const titleClassName = classNames({
      'user-name': true,
      'v-channel-name': profile.isChannel,
      channel: profile.isChannel,
      [`channel-${profile.id}`]: profile.isChannel,
    });

    return (
      <div className={containerClassName}>
        <div className="tile-container">
          {this._renderAvatar()}

          <h2 className={titleClassName}>{profile.get('full_name')}</h2>

          {this._renderBio()}
          {this._renderManagers()}
          {this._renderChannels()}

          <div className="properties">
            {this._renderFollowButtonOrReads()}
            {this._renderFollowers()}
            {this._renderFollowingButton()}
          </div>
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/ProfileTile.js