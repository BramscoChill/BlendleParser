import alt from 'instances/altInstance';
import UsersManager from 'managers/users';
import FacebookManager from 'managers/facebook';
import { translate } from 'instances/i18n';
import Analytics from 'instances/analytics';
import Auth from 'controllers/auth';
import ReactDOM from 'react-dom';

class FacebookActions {
  constructor() {
    this.generateActions('loginAndConnectFacebookError', 'loginAndConnectFacebookSuccess');
  }

  connectFacebook(user) {
    return (dispatch) => {
      dispatch();

      FacebookManager.authorizeAndGetFriends(user)
        .then(users => this.facebookConnectSuccess(users))
        .catch(resp => this.facebookError(resp));
    };
  }

  toggleFacebook(user) {
    return (dispatch) => {
      dispatch();

      if (user.get('facebook_id')) {
        UsersManager.disconnectFromFacebook(user)
          .then(() => this.facebookDisconnectSuccess())
          .catch(resp => this.facebookError(resp));
      } else {
        this.connectFacebook(user);
      }
    };
  }

  facebookConnectSuccess(friends) {
    Analytics.track('Social Connect', { platform: 'facebook' });

    return friends;
  }

  facebookDisconnectSuccess() {
    Analytics.track('Social Disconnect', { platform: 'facebook' });

    return null;
  }

  facebookError(resp) {
    const analyticsError = resp.message;
    Analytics.track('Social Connect Error', { platform: 'facebook', error: analyticsError });

    return null;
  }

  loginAndConnectFacebook(email, password) {
    return (dispatch) => {
      dispatch();

      Auth.loginWithCredentials({
        login: email.trim(),
        password,
      })
        .then(() => {
          Analytics.track('Login Successful', {
            platform: 'facebook',
            login_type: 'manual',
          });
        })
        .then(() => {
          this.connectFacebook(Auth.getUser());
          Auth.navigateToReturnURL();
          ReactDOM.unmountComponentAtNode(document.querySelector('.a-dialogue'));
        })
        .catch(error => this.loginAndConnectFacebookError(error));
    };
  }
}

export default alt.createActions(FacebookActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/FacebookActions.js