import constants from 'app-constants';
import Environment from 'environment';
import axios from 'axios';
import i18n from 'instances/i18n';
import Country from 'instances/country';
import Analytics from 'instances/analytics';
import TradeTracker from 'instances/tradetracker';
import GoogleAnalytics from 'instances/google_analytics';
import { getUTMParameters } from 'helpers/url';
import BrowserEnvironment from 'instances/browser_environment';
import Settings from 'controllers/settings';
import Auth from 'controllers/auth';
import { load as loadFonts } from 'helpers/fonts';
import TypedError from 'helpers/typederror';
import loadScriptsWhenIdle from 'helpers/loadScriptsWhenIdle';
import InternationalLaunchHelper from 'helpers/internationalLaunch';
import ProviderActions from 'actions/ProviderActions';
import ProviderStore from 'stores/ProviderStore';
import LocalizationManager from 'managers/localization';
import React, { Component } from 'react';
import RouterContainer from 'containers/RouterContainer';
import Prerender from 'components/Application/Prerender';

function loadSettings() {
  return Settings.fetch({ accept: 'application/hal+json' }).catch(
    resp => new TypedError(constants.XHR, 'Unable to load api.json', resp),
  );
}

function loadUser() {
  return Auth.autoLogin().catch((err) => {
    // token expired
    if (err.type === constants.INVALID_TOKEN) {
      Analytics.track('JWT Expired', { type: 'autologin' });
      return Promise.resolve(null);
    }
    if (err.type === constants.NO_TOKEN) {
      return Promise.resolve(null);
    }
    if (err.status) {
      throw new TypedError(constants.MAINTENANCE, err.message, err);
    }
    throw err;
  });
}

function loadLocale() {
  const locale = Country.getLocale();
  return i18n
    .load(locale)
    .then(() => {
      // Set currency based on locale. This will be overwritten after a user authenticates
      if (!i18n.currentCurrency) {
        i18n.setCurrencyBasedOnLocale(locale);
      }
    })
    .catch((err) => {
      if (!(err instanceof Error)) {
        return new TypedError(constants.XHR, `Unable to load locale (${locale})`, err);
      }
      return err;
    });
}

function loadSupportedLocales() {
  return LocalizationManager.getSupported().then((res) => {
    i18n.setSupportedOptionsFromResponse(res);
    if (!Country.getCountryCode()) {
      Country.setCountryCode(res.countryHeader);
    }
    return res;
  });
}

function loadProviderStyles() {
  if (Environment.name !== 'test') {
    // next tick so it runs when the whole document has been loaded
    // this ensures a non-blocking load in IE11.
    setTimeout(() => {
      const link = document.createElement('link');
      link.href = 'https://provider-assets.blendlecdn.com/styles/providers.css';
      link.rel = 'stylesheet';
      document.querySelector('script').parentNode.appendChild(link);
    });
  }

  return Promise.resolve();
}

function loadUserAndValidateCountry() {
  return Promise.all([loadUser(), loadSupportedLocales()])
    .then(() => {
      // if the country isn't supported yet, we redirect to the fancy launch page
      if (!Auth.getUser() && InternationalLaunchHelper.shouldRedirect()) {
        // don't resolve the promise to make it blocking.
        // this will prevent the app from continuing the load flow
        return new Promise(() => {
          InternationalLaunchHelper.redirectToLaunchSite();
        });
      }

      if (Auth.getUser()) {
        Analytics.setUser(Auth.getUser());
      }

      return true;
    })
    .then(() => {
      // set a unsupported country to US
      if (!Country.isSupportedCountry()) {
        Country.setCountryCode(Country.getDefaultCountryCode());
      }
      return loadLocale();
    });
}

function loadBaseFonts() {
  if (BrowserEnvironment.isMobile()) {
    return Promise.resolve();
  }

  return loadFonts(
    [
      {
        family: 'GT-Walsheim',
      },
      {
        family: 'GT-Walsheim',
        style: 'bold',
      },
    ],
    1000,
  ).catch(() => Promise.resolve());
}

function requestMaintenanceState() {
  if (!Environment.maintenanceFile) {
    return Promise.reject();
  }
  return axios.get(`${Environment.maintenanceFile}?${Date.now()}`).then((resp) => {
    let message = '';
    if (resp && resp.data && resp.data.message) {
      message = resp.data.message;
    }
    return new TypedError(constants.MAINTENANCE, message, resp);
  });
}

export default class RootContainer extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      providersLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    ProviderActions.fetchProviderConfigurations.defer();

    const utmParams = getUTMParameters();
    Analytics.setUTMParameters(utmParams);
    GoogleAnalytics.setUTMParameters(utmParams);

    Promise.all([
      loadUserAndValidateCountry(),
      loadSettings(),
      loadBaseFonts(),
      loadProviderStyles(),
    ]).then(this._onReady.bind(this), this._onError.bind(this));

    ProviderStore.listen(this._onProvidersStoreChanged);

    // If this is a TradeTracker visit, we need to perform the trackback logic
    const search = window.location.search;
    const tradeTrackerParam = TradeTracker.getTradeTrackerParam(search);
    if (tradeTrackerParam) {
      TradeTracker.redirectTrackBack(tradeTrackerParam, window.location.pathname);
    }

    setTimeout(() => {
      requestMaintenanceState().then(this._onError.bind(this), () => null);
    }, 1000);
  }

  componentWillUnmount() {
    ProviderStore.unlisten(this._onProvidersStoreChanged);
  }

  _isReady() {
    return !this.state.loading && !this.state.providersLoading;
  }

  _onReady() {
    this.setState({ loading: false });

    // download other chunks in the background after a small delay
    // it uses requestIdleCallback which isn't widely supported yet and we don't want to
    // interfere the application too much.
    setTimeout(() => {
      loadScriptsWhenIdle(window.__chunkFiles);
    }, 1000);
  }

  _onProvidersStoreChanged = (storeState) => {
    if (storeState.status === constants.STATUS_OK) {
      setTimeout(() => this.setState({ providersLoading: false }));
    }
  };

  _onError(error) {
    if (this.state.error && this.state.error.type === constants.MAINTENANCE) {
      return; // Don't show error when in maintenance
    }

    // Do not resolve to error if in maintenance mode
    if (error.type === constants.MAINTENANCE) {
      this.setState({
        error,
        loading: false,
      });
      return Promise.reject(error);
    }

    // Sentry
    window.ErrorLogger.captureException(error);

    // @TODO googlebot crashes for unknown reasons. Hide the fail message for it, for now...
    if (!window.navigator.userAgent.match(/googlebot/i)) {
      this.setState({
        error,
        loading: false,
      });
    }

    // If the current environment is 'production', console.error the error message and
    // resolve promise to ensure errors don't break the application
    if (Environment.name === 'production') {
      /* eslint-disable */
      console.error(error.message);
      /* eslint-enable */
      return Promise.resolve();
    }

    return Promise.reject(error);
  }

  render() {
    if (!this._isReady()) {
      return <Prerender />;
    }
    return <RouterContainer error={this.state.error} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/containers/RootContainer.js