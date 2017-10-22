import moment from 'moment';

moment.updateLocale('en', {
  calendar: {
    sameDay: '[today]',
    nextDay: '[tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[yesterday]',
    lastWeek: '[last] dddd',
    sameElse: 'dddd, MMMM Do YYYY',
  },
  longDateFormat: {
    l: 'M/D/Y',
  },
});

export default {
  momentLocale: 'en',
  sharePrivacyWithProviders: false,
  sectionIntroLongDateFormat: 'dddd, MMMM D',
};



// WEBPACK FOOTER //
// ./src/js/app/config/locale/en.js