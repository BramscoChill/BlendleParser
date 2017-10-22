import FormView from 'views/helpers/form';
import { translate } from 'instances/i18n';
import DropdownView from 'views/helpers/dropdown';
import FormFieldView from 'views/forms/elements/field';

export default FormView.extend({
  render() {
    const timezoneFormField = this.addView(
      new FormFieldView({
        label: translate('settings.profile.timezone'),
        value: this._getLabelValue(this.options.selected),
        input: this._getDropdown(),
        onSave: (value) => {
          const displayValue = this._getLabelValue(value);
          this.options.onSave(timezoneFormField, 'time_zone', value, displayValue);
        },
      }),
      'timezoneField',
    );

    timezoneFormField.render();

    return timezoneFormField;
  },

  _getLabelValue(id) {
    return this.options.timezones.find(timezone => timezone.id === id).name;
  },

  _getDropdown() {
    return this.addView(
      new DropdownView(this.options.timezones, {
        selected: this.options.selected,
        key: 'id',
        value: 'name',
      }),
      'timezoneDropdown',
    );
  },
});



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/views/locale/timezone.js