import { providerLocales } from 'config/settings';

export default function countryToLanguages(countryCode) {
  if (countryCode === 'all') {
    return providerLocales;
  }
  return providerLocales.filter(locale => locale.split('_')[0] === countryCode.toLowerCase());
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/countryToLanguages.js