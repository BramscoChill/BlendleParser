import FormView from 'views/helpers/form';
import i18n from 'instances/i18n';
import DropdownView from 'views/helpers/dropdown';
import FormFieldView from 'views/forms/elements/field';

export default FormView.extend({
  render() {
    const countries = this._getCountries();
    const countryDropdown = this._getDropdown();

    const countryFormField = this.addView(
      new FormFieldView({
        label: i18n.locale.settings.profile.location,
        value: this.options.selected,
        input: countryDropdown,
        valueToString: value => countries[value],
        onSave: (value) => {
          this.options.onSave(countryFormField, 'country', value);
        },
      }),
      'countryfield',
    );

    countryFormField.render();

    return countryFormField;
  },

  _getDropdown() {
    const items = this._getCountries();

    return this.addView(
      new DropdownView(items, {
        selected: this.options.selected,
      }),
      'countrydropdown',
    );
  },

  _getCountries() {
    const countries = {};

    i18n.supportedCountries.forEach((countryCode) => {
      countries[countryCode] = i18n.locale.countries[countryCode];
    });

    return countries;
  },
});



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/locale/country.js