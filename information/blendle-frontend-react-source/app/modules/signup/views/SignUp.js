import _ from 'lodash';
import PropTypes from 'prop-types';
import ByeBye from 'byebye';
import React from 'react';
import createReactClass from 'create-react-class';
import ApplicationState from 'instances/application_state';
import Analytics from 'instances/analytics';
import Auth from 'controllers/auth';
import UserManager from 'managers/users';
import i18n from 'instances/i18n';
import Country from 'instances/country';
import Issues from 'collections/issues';
import KioskManager from 'managers/kiosk';
import SignUpManager from 'managers/signup';
import * as ChannelManager from 'managers/channel';
import ProviderManager from 'managers/provider';
import FacebookManager from 'managers/facebook';
import BlendleSignUp from 'models/blendlesignup';
import FacebookSignUp from 'models/facebooksignup';
import PaneGroup from './PaneGroup';
import Kiosk from './kiosk/Kiosk';
import Channels from './channels/Channels';
import About from './about/About';
import AccountEmail from './account/AccountEmail';
import AccountSignIn from './account/AccountSignIn';
import AccountFirstName from './account/AccountFirstName';
import AccountLastName from './account/AccountLastName';
import AccountPassword from './account/AccountPassword';
import AccountResetPassword from './account/AccountResetPassword';
import Social from './social/Social';
import VerifyEmail from './verify/VerifyEmail';
import VerifyFinalize from './verify/VerifyFinalize';
import VerifyRequired from './verify/VerifyRequired';
import {
  EMAIL_BLACKLISTED,
  EMAIL_CONTAINS_PLUS_SIGN,
  USER_ID_TAKEN,
  STATUS_OK,
  SIGNUP_TYPE_ONBOARDING,
} from 'app-constants';

/**
 * create a new Pane object
 * @param {string} name
 * @param {boolean} enabled
 * @param {Function} component
 * @returns {Pane}
 */
function createPane(name, enabled, component) {
  return {
    name,
    component,
    enabled,
  };
}

/**
 * @returns {Boolean}
 */
function isUserWithConfirmedEmail() {
  const user = Auth.getUser();
  return user && user.get('email_confirmed');
}

const SignUp = createReactClass({
  displayName: 'SignUp',

  propTypes: {
    scenario: PropTypes.string,
    user: PropTypes.object,
    onClose: PropTypes.func,
  },

  getInitialState() {
    const user = this.props.user;
    const panes = this._getPanes(this.props.scenario, this.props.user);

    return {
      analyticsType: 'signup',
      analyticsPlatform: 'blendle',
      analyticsFirstTime: true,
      analyticsDeeplink: false,
      showTimelineGift: true,
      issues: {},
      selectedIssues: [],
      channels: [],
      user: user || new ByeBye.Model(),
      shareInformation: false,
      followTwitter: null,
      followFacebook: null,
      userVerified: null,
      resendEmail: null,
      error: null,
      changeEmailExists: false,
      currentPane: panes[0],
      selectedChannels: [],
      allowSkipEmail: true,
      panes,
    };
  },

  componentWillMount() {
    this._onLocale();
    i18n.on('switch', this._onLocale);
  },

  _onLocale() {
    this._fetchChannels();
    this._fetchNewsStand();
    this._resetSelections();
  },

  _resetSelections() {
    this.setState({
      selectedChannels: [],
      selectedIssues: [],
    });
  },

  setMountedState(state) {
    if (this.isMounted()) {
      this.setState(state);
    }
  },

  _fetchChannels() {
    const options = {};

    if (!Auth.getUser()) {
      options.country = Country.getCountryCode();
    }

    ChannelManager.fetchChannels(options).then((channels) => {
      this.setMountedState({ channels: channels.models });
    });
  },

  _fetchNewsStand() {
    KioskManager.getCountryNewsStand(Country.getCountryCode()).then((links) => {
      const issues = {};
      const queue = links.categories.map((category) => {
        const collection = new Issues();
        issues[category.id] = collection;

        return collection.fetch({ url: category.href }).catch(err => Promise.resolve());
      });

      Promise.all(queue).then(() => {
        this.setMountedState({ issues });
      });
    });
  },

  _filterWebCovers(issues) {
    return issues.filter(issue => issue.get('representations').indexOf('pages') > -1);
  },

  componentWillReceiveProps(newProps) {
    if (newProps.user !== this.props.user && newProps.user === Auth.getUser()) {
      this.setState({
        user: Auth.getUser(),
        userVerified: Auth.getUser().get('email_confirmed') ? STATUS_OK : this.state.userVerified,
      });
    }

    // the scenario changes, so should the panes
    if (newProps.scenario !== this.props.scenario) {
      this.setState({
        panes: this._getPanes(newProps.scenario, Auth.getUser() || this.state.user),
      });
    }
  },

  _getPanes(scenario, user) {
    const self = this;

    const isFacebookUser = user && user.get('facebook_id');
    const isExistingUser = user && Auth.getUser() === user;

    return [
      createPane('kiosk', true, active => (
        <Kiosk
          disabled={!active}
          issues={self.state.issues}
          selection={self.state.selectedIssues}
          onSelect={self.onSelectIssue}
          onSubmit={self.onKioskSubmit}
        />
      )),

      createPane('channels', true, active => (
        <Channels
          disabled={!active}
          channels={self.state.channels}
          selection={self.state.selectedChannels}
          onSelect={self.onSelectChannel}
          onPrev={self.onPrevPane}
          onSubmit={self.onChannelSubmit}
        />
      )),

      // Don't show about pane when you already have an account or did
      // signup via deeplink. You already accepted the terms and conditions
      createPane('about', !isExistingUser, active => (
        <About disabled={!active} onPrev={self.onPrevPane} onSubmit={self.onAboutSubmit} />
      )),

      // Don't show about pane when you already have an account or did
      // signup via deeplink. You already set an e-mail
      createPane('accountEmail', !isExistingUser, active => (
        <AccountEmail
          loading={self.state.isCheckingEmail}
          disabled={!active}
          user={self.state.user}
          shareInformation={self.state.shareInformation}
          error={self.state.error}
          onPrev={self.onPrevPane}
          onSubmit={self.onAccountEmailSubmit}
          onFacebookSignIn={self.onAccountEmailFacebookSignIn}
        />
      )),

      // Don't show about pane when you already have an account or did
      // signup via deeplink. You only need to do this when you're not
      // logged in through a server call.
      createPane('accountSignIn', !isExistingUser, active => (
        <AccountSignIn
          disabled={!active}
          user={self.state.user}
          onForgotPassword={self.onAccountSignInForgotPassword}
          onPrev={self.onPrevPane}
          onSubmit={self.onAccountSignInSubmit}
        />
      )),

      createPane('accountPassword', !isExistingUser, active => (
        <AccountPassword
          disabled={!active}
          user={self.state.user}
          onPrev={self.onPrevPane}
          onSubmit={self.onAccountPasswordSubmit}
        />
      )),

      createPane('accountResetPassword', false, active => (
        <AccountResetPassword
          disabled={!active}
          token={self.state.resetToken || ''}
          onPrev={self.onPrevPane}
          onSubmit={self.onAccountResetPasswordSubmit}
        />
      )),

      createPane('accountFirstName', !isFacebookUser, active => (
        <AccountFirstName
          disabled={!active}
          user={self.state.user}
          onSubmit={self.onAccountFirstNameSubmit}
        />
      )),

      createPane('accountLastName', !isFacebookUser, active => (
        <AccountLastName
          disabled={!active}
          user={self.state.user}
          onPrev={self.onPrevPane}
          onSubmit={self.onAccountLastNameSubmit}
        />
      )),

      createPane('social', true, active => (
        <Social
          disabled={!active}
          user={self.state.user}
          followTwitter={self.state.followTwitter}
          followFacebook={self.state.followFacebook}
          onSubmit={self.onSocialSubmit}
        />
      )),

      createPane('verifyEmail', !isUserWithConfirmedEmail(), active => (
        <VerifyEmail
          disabled={!active}
          user={self.state.user}
          onChangeEmail={self.onVerifyEMailChangeEmail}
          emailExists={self.state.changeEmailExists}
          isResend={self.state.resendEmail}
          onResend={self.onVerifyEmailResend}
        />
      )),

      createPane('verifyFinalize', isUserWithConfirmedEmail(), active => (
        <VerifyFinalize
          disabled={!active}
          user={self.state.user}
          onFinalized={self.onVerifyFinalized}
          verified={self.state.userVerified}
          hidden={self.state.hidden}
        />
      )),

      createPane('verifyRequired', isUserWithConfirmedEmail(), active => (
        <VerifyRequired
          user={self.state.user}
          isResend={self.state.resendEmail}
          onResend={self.onVerifyEmailResend}
        />
      )),
    ];
  },

  /**
   * set the enabled state of panes
   * The returned promise is usable for showing the next pane, since we're updating the next pane
   * the pane transition breaks if the current pane wasn't the next pane
   * @param {Object} togglePanes
   * @returns {Promise}
   * @private
   */
  _togglePanes(togglePanes) {
    return new Promise((resolve) => {
      _.forOwn(togglePanes, (value, key) => {
        _.find(this.state.panes, { name: key }).enabled = value;
      });
      this.forceUpdate(() => {
        setTimeout(resolve);
      });
    });
  },

  /**
   * navigate a direction by a given index in/decrement
   * @param {Number} indexIncrement
   */
  _navigatePane(indexIncrement) {
    const enabledPanes = this.state.panes.filter(pane => pane.enabled);
    const nextPane = enabledPanes[enabledPanes.indexOf(this.state.currentPane) + indexIncrement];

    this.setState({ currentPane: nextPane });
  },

  // small timeout is to make sure the next panes are already rendered by react
  _showPrevPane() {
    setTimeout(this._navigatePane(-1), 50);
  },

  _showNextPane() {
    setTimeout(this._navigatePane(1), 50);
  },

  _showPaneByName(name) {
    const nextPane = _.find(this.state.panes, { name });
    nextPane.enabled = true;
    this.setState({ currentPane: nextPane });
  },

  /**
   * when the user submits the 'pick an issue' form
   */
  onPaneChange(currentPane, nextPane, indexIncrement) {
    this.props.onPaneChange(currentPane, nextPane, indexIncrement);
  },

  /**
   * when the user hits the 'back' link
   */
  onPrevPane() {
    this._showPrevPane();
  },

  /**
   * when the user submits the 'pick an issue' form
   */
  onKioskSubmit() {
    this._showNextPane();
    return Promise.resolve();
  },

  /**
   * when the user selects/deselects an issue in the kiosk view
   * @param {Boolean} selectState
   * @param {String} providerId
   */
  onSelectIssue(selectState, providerId) {
    const selectedIssues = this.state.selectedIssues;
    if (selectState) {
      selectedIssues.push(providerId);
    } else {
      selectedIssues.splice(selectedIssues.indexOf(providerId), 1);
    }

    this.setState({
      selectedIssues: [].concat(selectedIssues),
    });
  },

  /**
   * when the user submits the 'pick a channel' form
   */
  onChannelSubmit() {
    this._showNextPane();
    return Promise.resolve();
  },

  /**
   * when the user selects/deselects an channel in the channel view
   * @param {Boolean} selectState
   * @param {Object} channel
   */
  onSelectChannel(selectState, channel) {
    const selectedChannels = this.state.selectedChannels;
    if (selectState) {
      selectedChannels.push(channel.get('id'));
    } else {
      selectedChannels.splice(selectedChannels.indexOf(channel.get('id')), 1);
    }

    this.setState({
      selectedChannels: [].concat(selectedChannels),
    });
  },

  /**
   * when the user submits the about page
   */
  onAboutSubmit() {
    Analytics.track('Signup/Start', {
      deeplink: this.state.analyticsDeeplink,
    });

    if (Auth.getUser()) {
      return this._saveOnboarding().then(() => {
        this._showNextPane();
        return Promise.resolve();
      });
    }

    this._showNextPane();
    return Promise.resolve();
  },

  /**
   * when the user want to use an email address for creating an account, and with a small checkbox
   * for to share his information with publishers
   * @param {Object}
   *        	{String} email
   *        	{Boolean} shareInformation
   */
  onAccountEmailSubmit({ email, shareInformation }) {
    this.setState({ shareInformation });

    email = email.trim().toLowerCase();

    // simple email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return Promise.reject();
    }

    SignUpManager.emailIsAllowed(email)
      .then(() => {
        this.setState({
          isCheckingEmail: true,
          error: null,
        });

        this.setState({
          analyticsPlatform: 'blendle',
          user: new BlendleSignUp({
            email,
          }),
        });

        Analytics.track('Signup/User info', {
          platform: this.state.analyticsPlatform,
          deeplink: this.state.analyticsDeeplink,
        });

        Analytics.track('Signup/Email', {
          platform: this.state.analyticsPlatform,
          deeplink: this.state.analyticsDeeplink,
        });

        return SignUpManager.emailIsAvailable(email);
      })
      .then(() => {
        // Email is available, so create user
        this.state.user.set({
          country: Country.getCountryCode(),
        });

        return SignUpManager.signup(this.state.user, SIGNUP_TYPE_ONBOARDING).then(token =>
          Auth.loginWithToken(token),
        );
      })
      .then(() => {
        // User is created, continue signup process
        this._togglePanes({
          accountSignIn: false,
          accountFirstName: true,
          accountLastName: true,
          accountPassword: true,
          verifyEmail: true,
        }).then(() => this._showNextPane());

        this.setState({ analyticsFirstTime: true });
      })
      .catch((error) => {
        this.setState({
          isCheckingEmail: false,
        });

        if (error.type === EMAIL_BLACKLISTED || error.type === EMAIL_CONTAINS_PLUS_SIGN) {
          this.setState({ error });
          return;
        }

        if (error.type === USER_ID_TAKEN) {
          // email is taken, so let the user enter his password to sign-in
          this._togglePanes({
            accountSignIn: true,
            accountFirstName: false,
            accountLastName: false,
            accountPassword: false,
          }).then(() => this._showNextPane());

          this.setState({ analyticsFirstTime: false });

          Analytics.track('Login Start', {
            platform: this.state.analyticsPlatform,
            deeplink: this.state.analyticsDeeplink,
          });
          return;
        }

        return Promise.reject();
      })
      .fin(() => {
        this.setState({
          isCheckingEmail: false,
        });
      });

    return Promise.resolve();
  },

  /**
   * when the user want to use a facebook account for creating an account.
   * sign in at facebook and try to create a new account,
   * or just login and redirect to the homepage
   */
  onAccountEmailFacebookSignIn() {
    this.setState({
      analyticsPlatform: 'facebook',
      analyticsFirstTime: true,
    });

    return FacebookManager.login()
      .then(this._saveOnboarding)
      .then(
        () => {
          this.setState({
            showTimelineGift: false,
          });
          this._showPaneByName('verifyFinalize');

          Analytics.track('Login Successful', {
            platform: this.state.analyticsPlatform,
            deeplink: this.state.analyticsDeeplink,
            login_type: 'signup',
          });
        },
        (fbToken) => {
          const fbUser = new FacebookSignUp({
            facebook_id: fbToken.authResponse.userID,
            facebook_access_token: fbToken.authResponse.accessToken,
            providers_opt_in: this.state.shareInformation,
            country: Country.getCountryCode(),
          });

          Analytics.track('Signup/User info', {
            platform: this.state.analyticsPlatform,
            deeplink: this.state.analyticsDeeplink,
          });

          return SignUpManager.signup(fbUser)
            .then(token => Auth.loginWithToken(token), err => Promise.reject(err))
            .then(token => token.get('user'))
            .then(this._saveOnboarding)
            .then(() => {
              const token = Auth.getToken();

              this.setState({
                user: token.get('user'),
                showTimelineGift: true,
              });

              this._togglePanes({
                accountSignIn: false,
                accountFirstName: false,
                accountLastName: false,
                accountPassword: false,
                social: true,
                verifyEmail: false, // already verified by facebook :-)
                verifyFinalize: true,
              });

              this._showNextPane();

              return Promise.resolve(token);
            });
        },
      );
  },

  /**
   * when the user signs in with their existing e-mail account
   * @param {String} password
   * @returns {Promise}
   */
  onAccountSignInSubmit(password) {
    this.setState({ analyticsPlatform: 'blendle' });

    return Auth.loginWithCredentials({
      login: this.state.user.get('email'),
      password,
    })
      .then((res) => {
        Analytics.track('Login/Password');

        Analytics.track('Login Successful', {
          platform: this.state.analyticsPlatform,
          deeplink: this.state.analyticsDeeplink,
          login_type: 'manual',
        });

        this.state.analyticsType = 'login';
        this.state.analyticsFirstTime = false;

        return Promise.resolve(res);
      })
      .then(this._saveOnboarding)
      .then(() => {
        this.setState({
          showTimelineGift: false,
        });

        this._togglePanes({
          social: false,
          verifyEmail: !isUserWithConfirmedEmail(),
          verifyFinalize: true,
        });

        this._showNextPane();

        return Promise.resolve();
      });
  },

  _saveOnboarding() {
    return Auth.fetchUser().then(
      Promise.all([
        ChannelManager.follow(Auth.getUser(), this.state.selectedChannels),
        ProviderManager.favorite(Auth.getUser().id, this.state.selectedIssues, true),
        Auth.getUser().savePreferences({ did_onboarding: true }),
      ]),
    );
  },

  /**
   * when the user signs in with their existing e-mail account
   * @param {string} email
   * @returns {Promise}
   */
  onAccountSignInForgotPassword(email) {
    Analytics.track('Signup/Request Password', {
      platform: this.state.analyticsPlatform,
      deeplink: this.state.analyticsDeeplink,
    });

    return UserManager.requestResetToken(email);
  },

  /**
   * when the user sets the new password on the /login/reset pane
   * @param {string} newPassword
   * @param {string} resetToken
   */
  onAccountResetPasswordSubmit(newPassword, resetToken) {
    Analytics.track('Signup/Reset Password');

    return UserManager.resetPassword(resetToken, newPassword).then(() => {
      Auth.navigateToReturnURL();

      return Promise.resolve();
    });
  },

  /**
   * when the user has submits his first name
   * @param {String} firstName
   * @returns {Promise}
   */
  onAccountFirstNameSubmit(firstName) {
    if (firstName.trim() === '') {
      return Promise.reject();
    }

    Analytics.track('Signup/First name', {
      platform: this.state.analyticsPlatform,
      deeplink: this.state.analyticsDeeplink,
    });

    this.state.user.set('first_name', firstName.trim());

    this._showNextPane();
    return Promise.resolve();
  },

  /**
   * when the user has submits his last name
   * @param {String} lastName
   * @returns {Promise}
   */
  onAccountLastNameSubmit(lastName) {
    if (lastName.trim() === '') {
      return Promise.reject();
    }

    Analytics.track('Signup/Last name', {
      platform: this.state.analyticsPlatform,
      deeplink: this.state.analyticsDeeplink,
    });

    this.state.user.set('last_name', lastName.trim());

    // user already authenticated, save the updated name fields
    if (Auth.getUser() === this.state.user) {
      this.state.user.saveProperty({
        first_name: this.state.user.get('first_name'),
        last_name: this.state.user.get('last_name'),
        providers_opt_in: this.state.shareInformation,
      });
    }

    ApplicationState.saveToCookie();
    this._showNextPane();

    return Promise.resolve();
  },

  /**
   * when the user has submits his password
   * @param {String} password
   * @returns {Promise}
   */
  onAccountPasswordSubmit(password) {
    const self = this;

    Analytics.track('Signup/Password', {
      platform: this.state.analyticsPlatform,
      deeplink: this.state.analyticsDeeplink,
    });

    this.state.user.set({
      password,
    });

    return this.state.user
      .saveProperty({
        password: this.state.user.get('password'),
      })
      .then(() => {
        self._showNextPane();

        self._togglePanes({
          accountEmail: false,
          accountSignIn: false,
          accountPassword: false,
          social: true,
        });

        return Promise.resolve();
      })
      .then(this._saveOnboarding);
  },

  /**
   * when the user submits the 'follow your friends' form
   */
  onSocialSubmit() {
    Analytics.track('Signup/Send Confirmation', {
      platform: this.state.analyticsPlatform,
      deeplink: this.state.analyticsDeeplink,
    });

    if (isUserWithConfirmedEmail() && this.state.allowSkipEmail) {
      this._saveOnboarding().then(() => ByeBye.history.navigate('verified', { trigger: true }));
    } else {
      this._showNextPane();
    }

    return Promise.resolve();
  },

  /**
   * when the user clicks the 'resend the confirm email' button
   */
  onVerifyEmailResend(email) {
    const self = this;
    const user = Auth.getUser();
    if (!user) {
      return;
    }

    Analytics.track('Signup/Resend Confirmation', {
      platform: this.state.analyticsPlatform,
      deeplink: this.state.analyticsDeeplink,
      type: this.state.analyticsType,
    });

    return SignUpManager.resendEmailConfirmation(user).then(() => {
      self.setState({ resendEmail: true });
    });
  },

  onVerifyEMailChangeEmail(email) {
    const user = Auth.getUser();
    if (!user) {
      return;
    }

    this.setState({
      resendEmail: false,
      changeEmailExists: false,
    });

    SignUpManager.emailIsAvailable(email)
      .then(() => {
        user.saveProperty('email', email).then(() => {
          this.setState({ resendEmail: true });
        });
      })
      .catch(() => {
        this.setState({ changeEmailExists: true });
      });
  },

  /**
   * when the has verified his account
   */
  onVerifyFinalized() {
    if (!Auth.getUser()) {
      return;
    }

    this._saveOnboarding().then(() => {
      Analytics.track('Signup/complete', {
        platform: this.state.analyticsPlatform,
        deeplink: this.state.analyticsDeeplink,
      });

      Analytics.track('Login Successful', {
        platform: this.state.analyticsPlatform,
        deeplink: this.state.analyticsDeeplink,
        login_type: 'signup',
      });

      Analytics.track('Personalizing Account', {
        platform: this.state.analyticsPlatform,
        deeplink: this.state.analyticsDeeplink,
        type: this.state.analyticsType,
      });

      const showTimelineGift = this.state.showTimelineGift;
      setTimeout(() => {
        ByeBye.history.navigate(showTimelineGift ? 'verified' : '', { trigger: true });
        this.props.onClose();
      }, 500);
    });
  },

  render() {
    const currentIndex = this.state.panes.indexOf(this.state.currentPane);
    const numberOfPanes = this.state.panes.length;
    const progress = currentIndex / (numberOfPanes - 1) * 100;

    return (
      <PaneGroup
        panes={this.state.panes.filter(pane => pane.enabled)}
        progress={progress}
        disabled={this.state.disabled}
        current={this.state.currentPane}
        onPaneChange={this.onPaneChange}
      />
    );
  },
});

module.exports = SignUp;



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/views/SignUp.js