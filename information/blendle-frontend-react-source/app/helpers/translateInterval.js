import { translate } from 'instances/i18n';

export function translateInterval(intervalString) {
  const amount = intervalString.split(' ')[0];
  const period = intervalString.split(' ')[1];
  const periodKey = `app.time_units.${period}`;
  const translatedPeriod = translate(periodKey);
  return [amount, translatedPeriod].join(' ');
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/translateInterval.js