import moment from 'moment';
import lang from 'moment/locale/nl';

moment.updateLocale('nl', {
  calendar: {
    sameDay: '[vandaag]',
    sameElse: 'dddd D MMMM YYYY',
    nextDay: '[morgen]',
    nextWeek: 'dddd',
    lastDay: '[gisteren]',
    lastWeek: '[afgelopen] dddd',
  },
  longDateFormat: {
    l: 'D-M-Y',
  },
});

export default {
  momentLocale: 'nl',
  sharePrivacyWithProviders: true,
  sectionIntroLongDateFormat: 'dddd, D MMMM',
};



// WEBPACK FOOTER //
// ./src/js/app/config/locale/nl.js