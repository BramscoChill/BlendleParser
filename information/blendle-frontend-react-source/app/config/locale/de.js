import moment from 'moment';
import lang from 'moment/locale/de';

moment.updateLocale('de', {
  calendar: {
    sameDay: '[heute]',
    nextDay: '[morgen]',
    nextWeek: 'dddd',
    lastDay: '[gestern]',
    lastWeek: '[letzten] dddd',
    sameElse: 'dddd, D. MMMM YYYY',
  },
  longDateFormat: {
    l: 'D-M-Y',
  },
});

export default {
  momentLocale: 'de',
  sharePrivacyWithProviders: false,
  sectionIntroLongDateFormat: 'dddd, D. MMMM',
};



// WEBPACK FOOTER //
// ./src/js/app/config/locale/de.js