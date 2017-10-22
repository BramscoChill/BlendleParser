import ByeBye from 'byebye';
import AuthStore from 'stores/AuthStore';
import { sortBy } from 'lodash';
import fetchTimeZones from 'managers/settings';
import CountryView from './country';
import TimezoneView from './timezone';

export default ByeBye.View.extend({
  initialize(options) {
    fetchTimeZones()
      .then(timezones => sortBy(timezones, 'name'))
      .then((timezones) => {
        const { user } = AuthStore.getState();

        if (!user.hasActivePremiumSubscription()) {
          this.addView(
            new CountryView({
              selected: options.model.get('country'),
              onSave: options.onSave,
            }),
            'country',
          );
        }

        this.addView(
          new TimezoneView({
            selected: options.model.get('time_zone'),
            onSave: options.onSave,
            timezones,
          }),
          'timezone',
        );

        this.getViews().forEach(view => this.el.appendChild(view.render().el));
      });
  },
});



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/locale/settings.js