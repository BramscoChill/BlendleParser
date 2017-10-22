import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import dropdownMixin from 'components/mixins/DropdownMixin';
import classNames from 'classnames';
import i18n from 'instances/i18n';
import { getExceptionForCountry } from 'helpers/countryExceptions';

const locales = [
  { code: 'nl_NL', label: 'Nederland' },
  { code: 'de_DE', label: 'Deutschland' },
  { code: 'en_US', label: 'USA' },
  { code: 'fr_FR', label: 'Français' },
];

const LocaleDropdown = createReactClass({
  displayName: 'LocaleDropdown',

  propTypes: {
    // should be a locale code like `nl_NL`
    selected: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  },

  mixins: [dropdownMixin()],

  _onChange(code, ev) {
    ev.preventDefault();
    this.toggleDropdown();
    this.props.onChange(code);
  },

  _renderOptions() {
    return i18n.supportedCountryLocales
      .filter(
        locale => !getExceptionForCountry(locale.split('_')[1], 'hideFromCountrySelector', false),
      )
      .map(locale => find(locales, { code: locale }))
      .filter(x => x)
      .map(locale => (
        <a
          key={locale.code}
          href="#"
          className={`lang-${locale.code}`}
          onClick={this._onChange.bind(this, locale.code)}
        >
          {locale.label}
        </a>
      ));
  },

  _renderSelected() {
    const lang = find(locales, { code: this.props.selected });

    return (
      <div className={`lang-${lang.code}`}>
        <label>{lang.label}</label>
      </div>
    );
  },

  render() {
    const className = classNames('v-locale-dropdown', { 's-active': this.state.open });

    return (
      <div className={className}>
        <div className="handle" onClick={this.toggleDropdown}>
          {this._renderSelected()}
        </div>
        <div className="v-locale-list">{this._renderOptions()}</div>
      </div>
    );
  },
});

export default LocaleDropdown;



// WEBPACK FOOTER //
// ./src/js/app/components/navigation/LocaleDropdown.js