import _ from 'lodash';
import ByeBye from 'byebye';
import i18n from 'instances/i18n';
import Settings from 'controllers/settings';

export default {
  getCountryNewsStand(countryCode) {
    const countryIndex = Settings.get('links').onboarding_newsstand;
    let link = _.find(countryIndex, {
      name: countryCode,
    });

    // fallback to the default country newsStand
    if (!link) {
      link = _.find(countryIndex, {
        name: i18n.getCountryCode(i18n.getDefaultLocale()),
      });
    }

    return ByeBye.ajax({ url: link.href }).then(res => res.data._links);
  },

  getNewsStand(userId) {
    return ByeBye.ajax({
      url: Settings.getLink('newsstand', { user_context: userId }),
    }).then(res => res.data._links);
  },
};



// WEBPACK FOOTER //
// ./src/js/app/managers/kiosk.js