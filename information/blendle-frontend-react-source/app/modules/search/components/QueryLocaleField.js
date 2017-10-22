import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Select';
import i18n, { translate } from 'instances/i18n';
import country from 'instances/country';
import { providerLocales } from 'config/settings';

export default class QueryLocaleField extends React.Component {
  static propTypes = {
    locale: PropTypes.string,
    onChange: PropTypes.func,
  };

  _getLanguageCountries() {
    return providerLocales
      .filter((locale) => {
        const isCurrentLanguage = locale === i18n.getLocale();
        const isntBeta = !i18n.isBetaLocale(locale) && !country.isBetaCountry();
        return isCurrentLanguage || isntBeta;
      })
      .reduce((countries, locale) => {
        const country = i18n.getIso639_1(locale);
        if (!countries.includes(country)) {
          countries.push(country);
        }
        return countries;
      }, []);
  }

  render() {
    const options = this._getLanguageCountries().map(country => (
      <option key={country} value={country} selected={this.props.locale === country}>
        {translate(`languages.${country}`)}
      </option>
    ));

    return (
      <Select name="locale" onChange={this.props.onChange}>
        <option key="all" value="all" selected={this.props.locale === 'all'}>
          {translate('search.dropdown.all_languages')}
        </option>
        {options}
      </Select>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/QueryLocaleField.js