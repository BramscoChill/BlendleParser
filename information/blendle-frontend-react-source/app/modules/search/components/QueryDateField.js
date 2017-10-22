import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Select2';
import { translate } from 'instances/i18n';

class QueryDateField extends React.Component {
  static propTypes = {
    date: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onOpenPicker: PropTypes.func.isRequired,
  };

  _onPeriodChange = (value) => {
    if (value === 'custom') {
      this.props.onOpenPicker();
    } else {
      this.props.onChange(null);
    }
  };

  render() {
    const customLabel = this.props.date
      ? translate('app.date_range', [
        this.props.date.from.format('L'),
        this.props.date.to.format('L'),
      ])
      : translate('search.dropdown.custom_period');

    return (
      <Select className="dropdown-date" name="date" onChange={this._onPeriodChange}>
        <option key="always" value="always" selected={!this.props.date}>
          {translate('search.dropdown.all_periods')}
        </option>
        <option key="custom" value="custom" selected={!!this.props.date}>
          {customLabel}
        </option>
      </Select>
    );
  }
}

export default QueryDateField;



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/QueryDateField.js