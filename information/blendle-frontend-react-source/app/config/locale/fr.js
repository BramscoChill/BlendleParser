import moment from 'moment';
import 'moment/locale/fr';

moment.updateLocale('fr', {
  calendar: {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'dddd D MMMM YYYY',
  },
  longDateFormat: {
    l: 'D-M-Y',
  },
});

export default {
  momentLocale: 'fr',
  sharePrivacyWithProviders: false,
  sectionIntroLongDateFormat: 'dddd, MMMM D',
};



// WEBPACK FOOTER //
// ./src/js/app/config/locale/fr.js