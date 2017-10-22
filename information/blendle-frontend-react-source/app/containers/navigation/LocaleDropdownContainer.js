import React, { Component } from 'react';
import LocaleDropdown from 'components/navigation/LocaleDropdown';
import i18n from 'instances/i18n';
import Country from 'instances/country';

function onChangeLocale(langCode) {
  if (langCode === i18n.getLocale()) {
    return;
  }

  i18n.load(langCode);
  i18n.setCurrencyBasedOnLocale(langCode);

  Country.setCountryCode(langCode.slice(-2));
}

export default class LocaleDropdownContainer extends Component {
  state = {
    currentLocale: i18n.currentLocale,
  };

  componentDidMount() {
    i18n.on('switch initialize', this.setCurrentLocale);
  }

  componentWillUnmount() {
    i18n.off('switch initialize', this.setCurrentLocale);
  }

  setCurrentLocale() {
    this.setState({ currentLocale: i18n.currentLocale });
  }

  render() {
    return <LocaleDropdown selected={this.state.currentLocale} onChange={onChangeLocale} />;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/containers/navigation/LocaleDropdownContainer.js