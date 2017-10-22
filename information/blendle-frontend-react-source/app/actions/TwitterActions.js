import alt from 'instances/altInstance';
import TwitterManager from 'managers/twitter';
import Analytics from 'instances/analytics';

class TwitterActions {
  constructor() {
    this.generateActions('fetchTwitterFriendsSuccess');
  }

  connectTwitter(user, fetchFriends) {
    return (dispatch) => {
      dispatch();

      TwitterManager.authorize(user)
        .then(() => {
          this.twitterConnectSuccess();
          if (fetchFriends) {
            this.fetchTwitterFriends(user);
          }
        })
        .catch(error => this.twitterError(error));
    };
  }

  toggleTwitter(user) {
    return (dispatch) => {
      dispatch();

      if (typeof user.get('twitter_id') !== 'string') {
        this.connectTwitter(user);
      } else {
        TwitterManager.unauthorize(user)
          .then(() => this.twitterDisconnectSuccess())
          .catch(error => this.twitterError(error));
      }
    };
  }

  twitterConnectSuccess() {
    Analytics.track('Social Connect', { platform: 'twitter' });

    return null;
  }

  twitterDisconnectSuccess() {
    Analytics.track('Social Disconnect', { platform: 'twitter' });

    return null;
  }

  twitterError(error) {
    Analytics.track('Social Connect Error', { platform: 'twitter', error: error.message });

    return null;
  }

  fetchTwitterFriends(user) {
    TwitterManager.getFriends(user).then(users => this.fetchTwitterFriendsSuccess(users));
  }
}

export default alt.createActions(TwitterActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/TwitterActions.js