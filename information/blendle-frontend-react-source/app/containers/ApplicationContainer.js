import i18n from 'instances/i18n';
import Country from 'instances/country';
import ApplicationState from 'instances/application_state';
import Analytics from 'instances/analytics';
import logPerformance from 'helpers/logPerformance';
import BrowserEnvironment from 'instances/browser_environment';
import Settings from 'controllers/settings';
import Auth from 'controllers/auth';

import ApplicationStore from 'stores/ApplicationStore';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';

import ModuleNavigationActions from 'actions/ModuleNavigationActions';
import AuthActions from 'actions/AuthActions';
import LabActions from 'actions/LabActions';
import ChannelActions from 'actions/ChannelActions';

import Facebook from 'instances/facebook';
import zendesk from 'instances/zendesk';
import getUuid from 'helpers/uuid';
import ExperimentsActions from 'actions/ExperimentsActions';

import React, { Component } from 'react';
import Application from 'components/Application/Application';
import browserHistory from 'react-router/lib/browserHistory';
import { getItem, setItem } from 'helpers/localStorage';

// LinkClickHandler will listen to all clicks on links and handle/route them (pushState)
require('helpers/linkclickhandler');

export default class ApplicationContainer extends Component {
  constructor() {
    super();

    this.state = {
      status: ApplicationStore.getState().status,
      languageCode: i18n.getIso639_1(),
      user: Auth.getUser(),
      userAgent: {
        ...window.BrowserDetect,
        isDeprecated: BrowserEnvironment.isDeprecated(),
      },
    };
  }

  componentWillMount() {
    const uuid = getUuid();
    Analytics.setSession(uuid);

    Analytics.track('Session', {
      browser: window.BrowserDetect.browser,
      device: window.BrowserDetect.device,
      os: window.BrowserDetect.operatingSystem,
      version: window.BrowserDetect.version,
      orientation: BrowserEnvironment.getOrientation(),
      app: window.BrowserDetect.app,
      appVersion: window.BrowserDetect.appVersion,
      standalone: navigator.standalone !== undefined ? navigator.standalone : 'unknown',
    });
  }

  componentDidMount() {
    this._initFacebook();
    this._initZendesk();

    browserHistory.listen(this._onRoute.bind(this));

    // Standlone (like on iOS added to desktop) remembers last URl visited
    // so on re-open the app starts at it last url
    if (navigator.standalone) {
      browserHistory.listen(this._rememberLastVisitedURL.bind(this));
    }

    if (Settings.embedded) {
      window.parent.postMessage(
        {
          event: 'blendle.frame.hideclosebutton',
        },
        Settings.embeddedOrigin,
      );
    }

    i18n.on('initialized switch', (ev) => {
      this._setAnalyticsOrigin(ev);
      const languageCode = i18n.getIso639_1();
      this.setState({ languageCode });

      zendesk.execute('setLocale', languageCode);
    });

    ApplicationStore.listen(() => {
      this.setState({
        status: ApplicationStore.getState().status,
      });
    });

    // Load current application state from cookie
    ApplicationState.loadFromCookie();

    this._run();

    logPerformance.applicationRunning();
  }

  _authHandler() {
    const user = Auth.getUser();

    AuthActions.authenticateUser.defer(user);

    window.Raven.setTagsContext({ user_id: user.id });
    Analytics.setUser(user);
    Country.setCountryCode(user.get('country'));
    i18n.load(user.get('primary_language'));
    i18n.setCurrency(user.get('currency'));

    ChannelActions.fetchChannels.defer();

    zendesk.execute('identify', {
      name: user.get('full_name'),
      email: user.get('email'),
      organization: '',
    });

    // Next tick to make sure experiments are synced
    setTimeout(() => this.setState({ user }));
  }

  _run() {
    if (Auth.getUser()) {
      this._authHandler();
    } else {
      Auth.on('login', () => {
        this._authHandler();
      });
    }

    // Store the last visited url so we return to this on relaunch
    if (navigator.standalone) {
      browserHistory.replace(getItem('standaloneUrl'));
    }

    // Send the orientation to MixPanel when it changes.
    window.addEventListener('orientationchange', this._trackOrientation.bind(this));

    Auth.on('logout', i18n.resetCookie);
  }

  _initFacebook() {
    // Init Facebook. Don't do anything if it failed here. If it failed we will
    // know in other places we use the lib. Handle fails there.
    Facebook.execute('init', {
      appId: Facebook.appId,
      version: Facebook.version,
      status: true,
    });
  }

  _initZendesk() {
    zendesk.execute('setLocale', this.state.languageCode);
    zendesk.execute('setHelpCenterSuggestions', {
      url: true,
      labels: location.pathname.split('/'),
    });
  }

  _rememberLastVisitedURL() {
    if (!window.BrowserDetect.localStorageEnabled()) {
      return;
    }

    let activeUrl = ModuleNavigationStore.getState().activeUrl;
    if (activeUrl === 'logout') {
      activeUrl = '';
    }
    setItem('standaloneUrl', activeUrl);
  }

  _trackOrientation() {
    Analytics.track('Change orientation', {
      orientation: BrowserEnvironment.getOrientation(),
      location: ModuleNavigationStore.getState().activeUrl,
    });
  }

  _onRoute(location) {
    Analytics.urlChange();
    ModuleNavigationActions.setActiveUrl.defer(location.pathname);
    zendesk.execute('setHelpCenterSuggestions', {
      url: true,
      labels: location.pathname.split('/'),
    });
  }

  _setAnalyticsOrigin() {
    Analytics.setOrigin(Country.getCountryCode(), i18n.getLocale());
  }

  render() {
    return <Application {...this.state} {...this.props} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/containers/ApplicationContainer.js