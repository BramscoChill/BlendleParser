const Analytics = require('instances/analytics');
const React = require('react');
const createReactClass = require('create-react-class');
const Translate = require('components/shared/Translate');
const i18n = require('instances/i18n');
const FacebookManager = require('managers/facebook');
const FacebookInstance = require('instances/facebook');
const Auth = require('controllers/auth');
const Button = require('components/Button');

const FollowFacebook = createReactClass({
  displayName: 'FollowFacebook',

  getInitialState() {
    return {
      loading: false,
      friends: null,
      error: null,
    };
  },

  componentWillMount() {
    if (FacebookInstance.getAuthResponse()) {
      this._connect();
    }
  },

  // load the facepile widget
  componentDidMount() {
    if (FacebookInstance && FacebookInstance.lib && FacebookInstance.lib.XFBML) {
      FacebookInstance.lib.XFBML.parse();
    }
  },

  render() {
    let errorMessage = null;

    if (this.state.friends) {
      if (this.state.friends.length) {
        return (
          <div className="v-follow-facebook l-success" onClick={this._showUsers}>
            {i18n.translateElement('signup.social.follow.results', [this.state.friends.length])}
          </div>
        );
      }
      return (
        <div className="v-follow-facebook l-success">
          {i18n.translateElement('signup.social.follow.empty', false)}
        </div>
      );
    }

    if (this.state.error) {
      errorMessage = <p className="error-message">{this.state.error}</p>;
    }

    return (
      <div className="v-follow-facebook">
        <div className="lead">
          <h3>Facebook</h3>
          <p>{i18n.translate('signup.social.facebook.intro')}</p>
        </div>
        <p className="connect">
          <Button
            className="btn btn-facebook"
            loading={this.state.loading}
            onClick={this._submitConnect}
          >
            {i18n.translate('signup.social.follow.showFriends')}
          </Button>
        </p>
        <div
          className="facepile fb-facepile"
          data-app-id="157559707786240"
          data-href="https://www.facebook.com/blendle"
          data-max-rows="1"
          data-colorscheme="light"
          data-size="small"
          data-locale="nl_NL"
          data-width="400"
          data-show-count="true"
        />
        {errorMessage}
      </div>
    );
  },

  _submitConnect(e) {
    e.preventDefault();

    this._connect();
  },

  _connect() {
    this.setState({ loading: true });

    Analytics.track('Signup/Connect to Social Network', { platform: 'facebook' });

    FacebookManager.authorizeAndGetFriends(Auth.getUser())
      .then(this._connectSuccess)
      .catch(this._connectFailed);
  },

  _connectSuccess(users) {
    if (!this.isMounted()) {
      return;
    }

    this.setState({ friends: users, loading: false });
  },

  _connectFailed(err) {
    if (!this.isMounted()) {
      return;
    }

    let unknownError = true;
    const state = { loading: false };

    if (err.status === 422) {
      unknownError = false;
      state.error = i18n.translate('facebook.connected_to_other_account');
    }

    if (err.status === 500) {
      unknownError = false;
      state.error = i18n.translate('facebook.something_went_wrong');
    }

    if (err.type !== 'UnableToLogin') {
      unknownError = false;
    }

    this.setState(state);

    if (unknownError) {
      return Promise.reject(err);
    }
  },

  _showUsers(e) {
    e.preventDefault();
    let title;

    if (this.state.friends.length < 2) {
      title = i18n.translate('timeline.tiles.social_connect.popupTitleSingular', [
        this.state.friends.length,
        'Facebook',
      ]);
    } else {
      title = i18n.translate('timeline.tiles.social_connect.popupTitlePlural', [
        this.state.friends.length,
        'Facebook',
      ]);
    }

    require('controllers/dialogues').openUsers(title, this.state.friends);
  },
});

module.exports = FollowFacebook;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/social/FollowFacebook.js