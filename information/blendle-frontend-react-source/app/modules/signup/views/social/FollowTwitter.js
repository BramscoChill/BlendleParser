const Analytics = require('instances/analytics');
const React = require('react');
const i18n = require('instances/i18n');
const Button = require('components/Button');
const TwitterManager = require('managers/twitter');
const Auth = require('controllers/auth');

class FollowTwitter extends React.Component {
  state = {
    loading: false,
    friends: null,
    error: null,
  };

  render() {
    let errorMessage;

    if (this.state.friends) {
      if (this.state.friends.length) {
        return (
          <div className="v-follow-twitter l-success" onClick={this._showUsers}>
            {i18n.translateElement('signup.social.follow.results', [this.state.friends.length])}
          </div>
        );
      }
      return (
        <div className="v-follow-twitter l-success">
          {i18n.translateElement('signup.social.follow.empty', false)}
        </div>
      );
    }

    if (this.state.error) {
      errorMessage = <p className="error-message">{this.state.error}</p>;
    }

    return (
      <div className="v-follow-twitter">
        <div className="lead">
          <h3>Twitter</h3>
          <p>{i18n.translate('signup.social.twitter.intro')}</p>
        </div>
        <p className="connect">
          <Button className="btn-twitter" loading={this.state.loading} onClick={this._connect}>
            {i18n.translate('signup.social.follow.showFriends')}
          </Button>
        </p>
        {i18n.translateElement(
          <div className="facepile" />,
          'signup.social.twitter.facepile',
          false,
        )}
        {errorMessage}
      </div>
    );
  }

  _connect = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    Analytics.track('Signup/Connect to Social Network', { platform: 'twitter' });

    return TwitterManager.authorizeAndGetFriends(Auth.getUser())
      .then(this._connectSuccess)
      .catch(this._connectFailed);
  };

  _connectSuccess = (friends) => {
    this.setState({ friends, loading: false });
  };

  _connectFailed = (err) => {
    this.setState({ loading: false });

    if (err.type !== 'PopupClosed') {
      return Promise.reject(err);
    }
  };

  _showUsers = (e) => {
    e.preventDefault();
    let title;

    if (this.state.friends.length < 2) {
      title = i18n.translate('timeline.tiles.social_connect.popupTitleSingular', [
        this.state.friends.length,
        'Twitter',
      ]);
    } else {
      title = i18n.translate('timeline.tiles.social_connect.popupTitlePlural', [
        this.state.friends.length,
        'Twitter',
      ]);
    }

    require('controllers/dialogues').openUsers(title, this.state.friends);
  };
}

module.exports = FollowTwitter;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/social/FollowTwitter.js