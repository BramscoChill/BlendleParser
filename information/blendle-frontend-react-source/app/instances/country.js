import Cookies from 'cookies-js';
import features from 'config/features';
import Environment from 'environment';
import URI from 'urijs';
import settings from 'config/settings';

const Country = {
  _cookieKey: 'country_code',
  _countryCode: null,

  initialize() {
    const parameters = URI.parseQuery(document.location.search);
    const countryCode = parameters.country || Country.getCookie();

    if (countryCode) {
      Country.setCountryCode(countryCode);
    }
  },
  /**
   * Get the current country code
   * @return {String}
   */
  getCountryCode() {
    return this._countryCode;
  },

  /**
   * Get the default country code
   * @return {String}
   */
  getDefaultCountryCode() {
    return settings.defaultCountry;
  },

  /**
   * Set the country code
   * @param {String} countryCode (defaults to NL)
   */
  setCountryCode(countryCode) {
    countryCode = countryCode || Country.getDefaultCountryCode();

    if (settings.transformCountries[countryCode]) {
      countryCode = settings.transformCountries[countryCode];
    }

    this._countryCode = countryCode;

    this._setCookie(countryCode);
  },

  /**
   * Get country code cookie
   * @return {String}
   */
  getCookie() {
    return Cookies.get(this._cookieKey);
  },

  clearCookie() {
    return Cookies.expire(this._cookieKey);
  },

  /**
   * Check if supplied or current country code is supported
   * @param  {String}  [countryCode]
   * @return {Boolean}
   */
  isSupportedCountry(countryCode) {
    if (!countryCode) {
      countryCode = this.getCountryCode();
    }

    return Country.getSupportedCountries().indexOf(countryCode) !== -1;
  },

  isBetaCountry(countryCode) {
    return Country.getBetaCountries().indexOf(countryCode || Country.getCountryCode()) !== -1;
  },

  isPremiumCountry(countryCode) {
    return Country.getPremiumCountries().indexOf(countryCode || Country.getCountryCode()) !== -1;
  },

  /**
   * Get an array of supported country codes
   * @return {Array}
   */
  getSupportedCountries() {
    let countries = settings.supportedCountries;
    countries = countries.concat(settings.betaCountries);

    if (features.showAlphaCountries) {
      countries = countries.concat(settings.alphaCountries);
    }

    return countries;
  },

  getBetaCountries() {
    if (features.showBetaAsReleased) {
      return [];
    }

    return settings.betaCountries;
  },

  getPremiumCountries() {
    return settings.premiumCountries;
  },

  /**
   * Transform the country code to a locale
   * @param  {String} countryCode
   * @return {String}
   */
  getLocale(countryCode) {
    countryCode = countryCode || Country.getCountryCode() || Country.getDefaultCountryCode();

    // @TODO we should change the way how we fetch locale files
    if (countryCode === 'US') {
      return 'en_US';
    }

    return `${countryCode.toLowerCase()}_${countryCode.toUpperCase()}`;
  },

  _setCookie(countryCode) {
    Cookies.set(this._cookieKey, countryCode, {
      expires: 3600 * 24 * 7 /* 7 days */,
      secure: Environment.ssl,
    });
  },
};

Country.initialize();

export default Country;



// WEBPACK FOOTER //
// ./src/js/app/instances/country.js