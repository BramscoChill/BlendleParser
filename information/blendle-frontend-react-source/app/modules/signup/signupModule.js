const ByeBye = require('byebye');
const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const features = require('config/features');
const country = require('instances/country');
const i18n = require('instances/i18n');
const Analytics = require('instances/analytics');
const ApplicationState = require('instances/application_state');
const SignUpManager = require('managers/signup');
const Auth = require('controllers/auth');
const SignUp = require('./views/SignUp');
const DialogueController = require('controllers/dialogues');
const InternationalLaunch = require('helpers/internationalLaunch');
const URI = require('urijs');
const LoginActions = require('actions/LoginActions');
import { STATUS_OK, STATUS_ERROR, STATUS_PENDING } from 'app-constants';

/* eslint-disable */
// code from the exoskeleton framework
const optionalParam = /\((.*?)\)/g;
const namedParam = /(\(\?)?:\w+/g;
const splatParam = /\*\w+/g;
const escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

function routeToRegExp(route) {
  const routeRegex = route
    .replace(escapeRegExp, '\\$&')
    .replace(optionalParam, '(?:$1)?')
    .replace(namedParam, (match, optional) => (optional ? match : '([^/]+)'))
    .replace(splatParam, '(.*?)');
  return new RegExp('^' + routeRegex + '$');
}
/* eslint-enable */

const SignUpModule = ByeBye.View.extend({
  name: 'signup',

  initialize() {
    this._routes = this._getRoutes();
  },

  /**
   * invokes the route function that matches the given path.
   * required for the 'React Module Root Containers' fixes
   * @param {String} path
   * @returns {*}
   */
  loadRoute(path) {
    const route = this._routes[path];
    if (route) {
      return route();
    }

    // try by regex per key with the backbone _routeToRegExp function
    Object.keys(this._routes).some((key) => {
      const regex = routeToRegExp(key);
      const match = new RegExp(regex).exec(path);
      if (match) {
        const args = match.slice(1).map(arg => (arg ? decodeURIComponent(arg) : null));
        this._routes[key](...args);
        return true;
      }
      return false;
    });
  },

  /**
   * get the signup scenario, basicly hides/shows panes
   * @returns {string}
   */
  getScenario() {
    const user = Auth.getUser();

    if (!user) {
      return 'signup';
    }
    if (user.didOnboarding()) {
      return 'verify';
    }

    return 'onboard';
  },

  /**
   * Calling this method will render the React component.
   * If it already is rendered, it will figur out if it should update the DOM
   * @private
   */
  _renderRootComponent() {
    const user = Auth.getUser();
    const scenario = this._scenario || this.getScenario();

    this._rootComponent = ReactDOM.render(
      <SignUp
        onClose={this.beforeUnload.bind(this)}
        onPaneChange={this._onPaneChange.bind(this)}
        scenario={scenario}
        user={user}
      />,
      this.target,
    );
  },

  loadOrWake() {
    if (
      country.isBetaCountry() &&
      !ApplicationState.get('signUpCode') &&
      InternationalLaunch.shouldRedirect()
    ) {
      InternationalLaunch.redirectToLaunchSite();
      return;
    }

    this._setScenarioAndRender();
  },

  load() {
    this._setScenarioAndRender();
  },

  _setScenarioAndRender() {
    if (!this._scenario) {
      this._scenario = this.getScenario();
    }
    this._renderRootComponent();
  },

  /**
   * when removing the module (like going to an other page)
   * we want to clean up React to free some memory
   */
  beforeUnload() {
    ReactDOM.unmountComponentAtNode(this.target);
    this._rootComponent = null;
  },

  /**
   * Used by other modules to show the signup process
   * @returns {*}
   */
  show() {
    return this._rerouteToKiosk();
  },

  /**
   * mark as deeplink for other flow and analytics
   */
  markAsDeeplinkSignUp() {
    this._deeplinkSignUp = true;
    if (this._rootComponent) {
      this._rootComponent.state.analyticsDeeplink = true;
    }
  },

  /**
   * get routing map
   * @returns {Object}
   * @private
   */
  _getRoutes() {
    return {
      signup: this._rerouteToKiosk.bind(this),
      'signup/kiosk': this._onKioskRoute.bind(this),
      'signup/channels': this._onProgressPaneRoute.bind(this, 'channels'),
      'signup/about': this._onProgressPaneRoute.bind(this, 'about'),
      'signup/account': this._onProgressPaneRoute.bind(this, 'accountEmail'),
      'signup/first-name': this._onProgressPaneRoute.bind(this, 'accountFirstName'),
      'signup/last-name': this._onProgressPaneRoute.bind(this, 'accountLastName'),
      'signup/password': this._onProgressPaneRoute.bind(this, 'accountPassword'),
      'signup/sign-in': this._onProgressPaneRoute.bind(this, 'accountSignIn'),
      'signup/social': this._onSocialRoute.bind(this),
      'signup/send-confirm': this._onProgressPaneRoute.bind(this, 'verifyEmail'),
      'signup/verify/:confirmationToken': this._onVerifyCodeRoute.bind(this),
      'signup/verified': this._onVerifyRoute.bind(this, null),
      'signup/unverified': this._onUnverifiedRoute.bind(this, 'verifyRequired'),

      login: this._onLoginRoute.bind(this),
      'login/warning': this._onLoginWarningRoute.bind(this),
      'login/reset(/:resetToken)': this._onResetPasswordRoute.bind(this),
    };
  },

  _rerouteToKiosk() {
    ByeBye.history.navigate(`${this.name}/kiosk`, { trigger: true, replace: true });
  },

  /**
   * when navigation happens at the PageGroup component
   * @this {SignUpModule}
   * @param {Pane} currentPane
   * @param {Pane} newPane
   * @param {Number} direction
   * @private
   */
  _onPaneChange(currentPane, newPane) {
    // some panes do have their own url
    const paneRouteMap = {
      // paneName: urlFragment
      kiosk: '/kiosk',
      channels: '/channels',
      about: '/about',
      accountEmail: '/account',
      accountFirstName: '/first-name',
      accountLastName: '/last-name',
      accountPassword: '/password',
      accountSignIn: '/sign-in',
      social: '/social',
      verifyEmail: '/send-confirm',
      verifyRequired: '/unverified',
      verifyFinalize: '/verified',
    };

    if (newPane && paneRouteMap[newPane.name] !== undefined) {
      const newUrl = `/${this.name}${paneRouteMap[newPane.name]}`;
      if (ByeBye.history.getCurrent().pathname !== newUrl) {
        ByeBye.history.navigate(newUrl, { replace: false, trigger: true });
      }
    }
  },

  /**
   * default pane handler
   * @param {string} paneName
   * @private
   */
  _onPaneRoute(paneName) {
    this.loadOrWake();
    this._setCurrentPaneByName(paneName);
  },

  /**
   * handler for the progress panes that only can be visited when the first pane has been viewed
   * used for panes like AccountFirstName and Social
   * @param {string} paneName
   * @private
   */
  _onProgressPaneRoute(paneName) {
    this.loadOrWake();

    // if the user hasn't started at the entry pane, we redirect to the entry pane
    if (!this._entryPaneVisited) {
      this._entryPaneVisited = true;
      const panes = this._rootComponent.state.panes;
      const firstPane = _.find(panes, { enabled: true });

      if (firstPane && firstPane.name !== paneName) {
        this._setCurrentPaneByName(firstPane.name);
        return;
      }
    }

    // When the user is authorized during the signUp, we want to disable accountPassword.
    // Placed inside this router method because the user can also change panes by clicking the browser back button.
    const user = Auth.getUser();

    if (paneName === 'accountPassword' && user && user.get('has_password')) {
      ByeBye.history.navigate(`/${this.name}/social`, { replace: false, trigger: true });
      return;
    }

    this._setCurrentPaneByName(paneName);
  },

  /**
   * handler for panes that are only visible when reached by the url.
   * used for the verifyRequired pane
   * @param {string} paneName
   * @private
   */
  _onSinglePaneRoute(paneName) {
    this.loadOrWake();

    // disable other panes
    this._rootComponent.state.panes.forEach((pane) => {
      pane.enabled = pane.name === paneName;
    });

    this._setCurrentPaneByName(paneName);
  },

  /**
   * Open the unverified page for unverified users
   */
  _onUnverifiedRoute() {
    const user = Auth.getUser();

    if (!user || user.get('email_confirmed')) {
      return ByeBye.history.navigate('/', { replace: true, trigger: true });
    }

    return this._onSinglePaneRoute('verifyRequired');
  },

  /**
   * first pane
   * @private
   */
  _onKioskRoute() {
    const user = Auth.getUser();
    if (user && user.didOnboarding() && !this._deeplinkSignUp) {
      ByeBye.history.navigate('/', { replace: true, trigger: true });
      return;
    }

    this._onProgressPaneRoute('kiosk');

    if (user && !this._welcomeUserPopupShown && !user.didOnboarding()) {
      this._welcomeUserPopupShown = true;
      DialogueController.openSignupProgress(user);
    }
  },

  /**
   * social pane can be visited by signed in users
   * guests should be redirected to the kiosk
   * @private
   */
  _onSocialRoute() {
    const user = Auth.getUser();

    if (user && user.didOnboarding() && !this._deeplinkSignUp && !this._entryPaneVisited) {
      this.loadOrWake();

      // disable all panes until we reach the social pane
      // to make sure it starts at 0
      const panes = this._rootComponent.state.panes;
      for (let i = 0; i < panes.length; i++) {
        if (panes[i].name === 'social') {
          break;
        }
        panes[i].enabled = false;
      }

      this._rootComponent.setState({
        showTimelineGift: false,
        allowSkipEmail: false,
        panes,
      });
      this._setCurrentPaneByName('social');
      return;
    }

    if (!user) {
      ApplicationState.set('requireAuthUrl', '/signup/social');
    }

    this._onProgressPaneRoute('social');
  },

  /**
   * when the user wants to verify his account
   * @private
   */
  _onVerifyRoute() {
    this._onSinglePaneRoute('verifyFinalize');

    if (!this._rootComponent.state.userVerified) {
      const user = Auth.getUser();
      this._rootComponent.setState({
        userVerified: user && user.get('email_confirmed') ? STATUS_OK : STATUS_ERROR,
      });
    }
  },

  /**
   * when the user wants to verify his account by clicking the link on the email
   * @param {string} confirmationToken
   * @private
   */
  _onVerifyCodeRoute(confirmationToken) {
    const self = this;
    const requestQuery = URI(location.href).query(true);

    this._onSinglePaneRoute('verifyFinalize');

    self._rootComponent.setState({
      userVerified: STATUS_PENDING,
      hidden: requestQuery.skip_personalizing === 'true',
    });

    SignUpManager.confirmEmail(confirmationToken)
      .then((token) => {
        if (Auth.getToken()) {
          return Promise.resolve(Auth.getToken());
        }
        return Auth.loginWithToken(token);
      })
      .then((token) => {
        Analytics.track('Signup/Verify email', {
          platform: 'blendle',
        });

        self._rootComponent.setState({
          userVerified: STATUS_OK,
          analyticsPlatform: 'blendle',
          analyticsType: 'signup',
          user: token.get('user'),
        });
      })
      .catch((err) => {
        const user = Auth.getUser();
        self._rootComponent.setState({
          userVerified: user && user.get('email_confirmed') ? STATUS_OK : STATUS_ERROR,
        });
      });
  },

  /**
   * handler for panes that are only visible when reached by the url.
   * used for the verifyRequired pane
   * @param {string} token
   * @private
   */
  _onResetPasswordRoute(token) {
    if (token) {
      this._onSinglePaneRoute('accountResetPassword');
      this._rootComponent.setState({
        resetToken: token,
      });
    } else {
      this._onProgressPaneRoute('kiosk');
    }
  },

  /**
   * a shortcut url for support to send people to the login form
   * @private
   */
  _onLoginRoute() {
    this._onProgressPaneRoute('kiosk');

    const search = URI(location.href).query(true);
    if (search.email) {
      LoginActions.setEmail(search.email);
    }
  },

  /**
   * a shortcut url to the login form with a warning
   * @private
   */
  _onLoginWarningRoute() {
    this._onProgressPaneRoute('kiosk');
  },

  /**
   * set the pane group to show the given pane
   * @param {string} paneName
   * @private
   */
  _setCurrentPaneByName(paneName) {
    const state = this._rootComponent.state;
    const analyticsEvents = {
      kiosk: [
        'Browse Publications',
        {
          deeplink: state.analyticsDeeplink,
        },
      ],
      channels: [
        'Browse Channels',
        {
          deeplink: state.analyticsDeeplink,
        },
      ],
      about: [
        'View about Blendle',
        {
          deeplink: state.analyticsDeeplink,
        },
      ],
    };

    if (analyticsEvents[paneName]) {
      Analytics.track(...analyticsEvents[paneName]);
    }

    const pane = _.find(state.panes, { name: paneName });
    this._rootComponent.setState({
      currentPane: pane,
    });
  },
});

module.exports = new SignUpModule();



// WEBPACK FOOTER //
// ./src/js/app/modules/signup/signupModule.js