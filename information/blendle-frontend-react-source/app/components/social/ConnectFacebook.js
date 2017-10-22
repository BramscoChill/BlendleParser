import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Link from 'components/Link';
import AvatarImage from 'components/AvatarImage';
import UsernameTooltip from 'components/UsernameTooltip';
import { translate } from 'instances/i18n';

class ConnectFacebook extends React.Component {
  static propTypes = {
    twitterConnected: PropTypes.bool.isRequired,
    facebookFriends: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  _renderOthers = (users) => {
    if (users.length > 14) {
      return <p className="social-others">{translate('social.others', [users.length - 14])}</p>;
    }
  };

  _renderAvatars = users =>
    users.slice(0, 14).map(user => (
      <Link className="social-avatar-holder" href={`/user/${user.id}`}>
        <UsernameTooltip className="social-avatar-tooltip-holder" username={user.get('full_name')}>
          <AvatarImage
            className="social-avatar"
            src={user.getAvatarHref()}
            height="44"
            width="44"
          />
        </UsernameTooltip>
      </Link>
    ));

  _renderHeader = () => {
    if (this.props.facebookFriends.length === 0) {
      return translate('social.facebook.no_friends');
    }

    return translate('social.facebook.found_friends');
  };

  _renderBody = () => {
    if (!this.props.twitterConnected) {
      return (
        <div className="social-body social-body-connect">
          <p className="social-body-text">{translate('social.twitter.follow_suggestion')}</p>
          <Link href="/social/twitter" className="btn btn-twitter btn-fullwidth">
            {translate('social.twitter.button')}
          </Link>
        </div>
      );
    }

    return (
      <div className="social-body social-body-connect">
        <p className="social-body-text">{translate('social.facebook_twitter_connected')}</p>
        <Button className="btn btn-fullwidth btn-dismiss" onClick={this.props.onClose}>
          {translate('continue_reading')}
        </Button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <div className="social-header social-header-friends">
          <h2 className="social-header-title">{this._renderHeader()}</h2>
          {this._renderAvatars(this.props.facebookFriends)}
          {this._renderOthers(this.props.facebookFriends)}
        </div>
        {this._renderBody()}
      </div>
    );
  }
}

export default ConnectFacebook;



// WEBPACK FOOTER //
// ./src/js/app/components/social/ConnectFacebook.js