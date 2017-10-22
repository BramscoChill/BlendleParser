import React from 'react';
import PropTypes from 'prop-types';
import Dialogue from 'components/dialogues/Dialogue';
import Button from 'components/Button';
import { STATUS_OK, STATUS_PENDING } from 'app-constants';
import SocialLanding from 'components/social/ConnectLanding';
import ConnectFacebook from 'components/social/ConnectFacebook';
import ConnectTwitter from 'components/social/ConnectTwitter';

class SocialDialogue extends React.Component {
  static propTypes = {
    page: PropTypes.oneOf(['twitter', 'facebook', 'landing']).isRequired,
    onClose: PropTypes.func.isRequired,
    twitterConnected: PropTypes.bool.isRequired,
    twitterFriends: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    twitterStatus: PropTypes.number.isRequired,
    facebookConnected: PropTypes.bool.isRequired,
    facebookFriends: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    facebookStatus: PropTypes.number.isRequired,
  };

  _renderTwitterFriends = () => (
    <ConnectTwitter
      facebookConnected={this.props.facebookConnected}
      twitterFriends={this.props.twitterFriends}
      onClose={this.props.onClose}
    />
  );

  _renderFacebookFriends = () => (
    <ConnectFacebook
      twitterConnected={this.props.twitterConnected}
      facebookFriends={this.props.facebookFriends}
      onClose={this.props.onClose}
    />
  );

  _renderLanding = () => (
    <SocialLanding
      facebookConnected={this.props.facebookConnected}
      facebookStatus={this.props.facebookStatus}
      twitterConnected={this.props.twitterConnected}
      twitterStatus={this.props.twitterStatus}
    />
  );

  _renderBody = () => {
    if (this.props.page === 'twitter' && this.props.twitterConnected) {
      return this._renderTwitterFriends();
    }

    if (this.props.page === 'facebook' && this.props.facebookConnected) {
      return this._renderFacebookFriends();
    }

    return this._renderLanding();
  };

  render() {
    return (
      <Dialogue className="dialogue-social" onClose={this.props.onClose}>
        {this._renderBody()}
      </Dialogue>
    );
  }
}

export default SocialDialogue;



// WEBPACK FOOTER //
// ./src/js/app/components/dialogues/Social.js