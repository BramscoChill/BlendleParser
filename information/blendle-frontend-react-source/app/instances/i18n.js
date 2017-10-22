import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';
import ByeBye from 'byebye';
import TypedError from 'helpers/typederror';
import constants from 'app-constants';
import settings from 'config/settings';
import features from 'config/features';
import Cookies from 'cookies-js';
import formatCurrency from 'helpers/formatcurrency';
import getRevisionedFile from 'helpers/getRevisionedFile';
import CopyHelper from 'helpers/CopyHelper';
import { getItem } from 'helpers/localStorage';
import { sprintf } from 'sprintf-js';

const YEAR = 60 * 60 * 24 * 30 * 12;
const COOKIE_KEY = 'locale';

const copyHelperEnabled = getItem('copyHelper') === 'true';
const copyHelper = new CopyHelper(copyHelperEnabled);
if (copyHelperEnabled) {
  window.__exportCopy = () => {
    copyHelper.printReport();
  };
}

let initialized = false;

const i18n = {
  // contains the translation object
  locale: {},

  defaultLocale: settings.defaultLocale,
  defaultCurrency: settings.defaultCurrency,

  // contains locale specific config
  config: {},
  currentLocale: null,
  currentCurrency: null,

  setSupportedOptionsFromResponse(resp) {
    i18n.supportedCountries = this._getSupportedCountries(resp);
    i18n.supportedCountryLocales = this._getSupportedCountryLocales(resp);
  },

  load(locale) {
    if (!locale || !this.isSupportedLocale(locale)) {
      locale = settings.defaultLocale;
    }

    if (initialized && this.currentLocale === locale) {
      return Promise.resolve(this.locale);
    }

    return ByeBye.ajax({
      url: `/${getRevisionedFile(`locales/${locale}.json`)}`,
    }).then((resp) => {
      if (!_.isPlainObject(resp.data)) {
        return Promise.reject(
          new TypedError(constants.XHR, `Locale (${locale}) contains no data`, resp),
        );
      }

      this.currentLocale = locale;
      this.setCookie(locale);
      this.loadLocaleConfig();

      _.extend(this.locale, resp.data);

      if (initialized) {
        this.trigger('switch', this);
      } else {
        initialized = true;
        this.trigger('initialized', this);
      }

      return Promise.resolve(this.locale);
    });
  },

  setCurrency(currency) {
    this.currentCurrency = currency || this.defaultCurrency;
  },

  setCurrencyBasedOnLocale(locale) {
    let currency = {
      nl_NL: 'EUR',
      de_DE: 'EUR',
      en_US: 'USD',
    }[locale];

    if (!currency) {
      currency = i18n.defaultCurrency;
    }

    i18n.setCurrency(currency);
  },

  getLocale() {
    return i18n.currentLocale;
  },

  getCurrency() {
    return i18n.currentCurrency || settings.defaultCurrency;
  },

  getCurrencyWord(options = {}) {
    const currency = i18n.getCurrency().toLowerCase();

    if (options.plural) {
      return i18n.translate(`app.currency.${currency}.plural`);
    }

    return i18n.translate(`app.currency.${currency}.single`);
  },

  getDefaultLocale() {
    return i18n.defaultLocale;
  },

  /**
   * @param {String} [locale=currentLocale] nl_NL, en_US
   * @retuns {String} countryCode NL, US
   */
  getCountryCode(locale) {
    return (locale || i18n.currentLocale || i18n.defaultLocale).substr(3, 2);
  },

  /**
   * @param {String} [locale=currentLocale] nl_NL, en_US
   * @returns {String} isoCode nl, en
   */
  getIso639_1(locale) {
    return (locale || i18n.currentLocale || i18n.defaultLocale).substr(0, 2);
  },

  isSupportedLocale(val) {
    const locale = val || i18n.currentLocale || i18n.defaultLocale;

    let locales = settings.supportedLocales;

    if (features.showBetaAsReleased) {
      locales = locales.concat(settings.betaLocales);
    }

    if (features.showAlphaCountries) {
      locales = locales.concat(settings.alphaLocales);
    }

    return locales.indexOf(locale) > -1;
  },

  isBetaLocale(locale) {
    return !features.showBetaAsReleased && settings.betaLocales.indexOf(locale) !== -1;
  },

  setCookie(locale) {
    Cookies.set(COOKIE_KEY, locale, {
      expires: YEAR,
      secure: true,
    });
  },

  resetCookie() {
    Cookies.expire(COOKIE_KEY);
  },

  getCookie() {
    return Cookies.get(COOKIE_KEY);
  },

  loadLocaleConfig() {
    this.config = require(`config/locale/${this.getIso639_1()}.js`);
    moment.locale(this.config.momentLocale);
  },

  /**
   * find translation key and return the string
   * @param {String} path     path to the key in the locale json file
   * @param {Array|Object} [args=[]] arguments. see https://github.com/alexei/sprintf.js for docs
   * @returns {String}
   */
  translate(path, args = []) {
    copyHelper.addId(path);

    const str = _.get(i18n.locale, path);
    if (str === undefined) {
      throw new Error(`Translation for ${path} is not found.`);
    }

    if (Array.isArray(args)) {
      const escapedArgs = args.map(arg => _.escape(arg));

      return sprintf(str, ...escapedArgs);
    }

    if (typeof args === 'object') {
      return sprintf(str, _.mapValues(args, _.escape));
    }

    return sprintf(str, _.escape(args));
  },

  /**
   * find translation key and return a React element. The arguments aren't required, and can be used
   * in the following order;
   *
   * @example
   *  translateElement(path)
   *  translateElement(path, sanitize)
   *  translateElement(path, args)
   *  translateElement(path, args, sanitize)
   *  translateElement(node, path, sanitize)
   *  translateElement(node, path, args)
   *  translateElement(node, path, args, sanitize)
   *
   * @example
   *  translateElement('path.to.the.string') => <span>%s!</span>
   *  translateElement('path.to.the.string', ['Blendle']) => <span>Blendle!</span>
   *  translateElement(<p />, 'path.to.the.string', ['Blendle']) => <p>Blendle!</p>
   *  translateElement('path.to.the.string', false) => <span>with <em>HTML</em>!</span>
   *  translateElement('path.to.the.string') => <span>without &gt;em&lt;HTML&gt;/em&lt;!</span>
   *
   * @param {ReactElement} [node=<span />]  change the wrapper node as a React.Element
   * @param {String} path       path to the key in the locale json file
   * @param {Array|Object} [args=[]]   arguments for the sprintf replacement
   * @param {Boolean} [sanitize=true] sanitize the string, false=as html, true=as text
   * @returns {ReactElement}
   */
  translateElement(node = false, path = '', args = [], sanitize = true) {
    // node can be skipped, to make the function more readable in usage
    if (typeof node === 'string' || node === false) {
      node = <span />;
      path = arguments[0];
      args = arguments[1];
      sanitize = arguments[2];
    }

    // if arguments is a boolean, it probably is the sanitize argument
    if (typeof args === 'boolean') {
      sanitize = args;
      args = [];
    }

    // Export a new element for the translation.
    // This should be done because we want to render nested JSX/components to staticMarkup,
    // and then refs are broken; see https://github.com/facebook/react/issues/3344
    return React.createElement(i18n.TranslateElement, { node, path, args, sanitize });
  },

  /**
   * format any number value to a readable currency, via the formatcurrency helper
   * @param {Number} value
   * @returns {String} formatted
   */
  formatCurrency,

  _getSupportedLocales(resp) {
    const Country = require('instances/country');
    return (_.get(resp, ['_embedded', 'b:supported-locales', 'supported_locales']) || []).filter(
      locale => Country.getSupportedCountries().indexOf(locale.country_code) > -1,
    );
  },

  _getSupportedCountries(resp) {
    const Country = require('instances/country');
    return (_.get(resp, [
      '_embedded',
      'b:supported-countries',
      '_embedded',
      'b:supported-countries',
    ]) || []
    )
      .filter(locale => Country.getSupportedCountries().indexOf(locale.country_code) > -1)
      .filter(country => !country.locked)
      .map(country => country.country_code);
  },

  _getSupportedCountryLocales(resp) {
    const Country = require('instances/country');
    return (_.get(resp, [
      '_embedded',
      'b:supported-countries',
      '_embedded',
      'b:supported-countries',
    ]) || []
    )
      .filter(locale => Country.getSupportedCountries().indexOf(locale.country_code) > -1)
      .map(country => country.primary_locale);
  },
};

_.extend(i18n, ByeBye.Events);

function getClassName(node, path) {
  return node.props.className || `i18n-${path.replace(/\./g, '-')}`;
}

i18n.TranslateElement = ({ node, path, args = [] }) =>
  React.cloneElement(node, {
    className: getClassName(node, path),
    dangerouslySetInnerHTML: { __html: i18n.translate(path, args) },
  });

i18n.TranslateElement.propTypes = {
  node: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  args: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default i18n;



// WEBPACK FOOTER //
// ./src/js/app/instances/i18n.js