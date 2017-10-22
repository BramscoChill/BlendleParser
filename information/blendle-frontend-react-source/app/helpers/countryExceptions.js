import settings from 'config/settings';
import { get } from 'lodash';
import { getCountryCode } from 'instances/i18n';

export function getExceptionForCountry(countryCode, exception, defaultValue) {
  return get(settings.countryExceptions, [countryCode, exception], defaultValue);
}

export function getException(exception, defaultValue) {
  return getExceptionForCountry(getCountryCode(), exception, defaultValue);
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/countryExceptions.js