import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption } from '@blendle/lego';
import { translate } from 'instances/i18n';

const translateKeys = {
  now: 'item.share.day.now',
  today: 'item.share.day.today',
  tomorrow: 'item.share.day.tomorrow',
};

class PublicationDay extends PureComponent {
  static propTypes = {
    onDateChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    shareDates: PropTypes.arrayOf(PropTypes.string),
    date: PropTypes.string,
  };

  render() {
    return (
      <Select
        className={this.props.className}
        onSelectedValueChange={this.props.onDateChange}
        selectedValue={this.props.date}
      >
        {this.props.shareDates.map(date => (
          <SelectOption key={date} value={date}>
            {translate(translateKeys[date])}
          </SelectOption>
        ))}
      </Select>
    );
  }
}

export default PublicationDay;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/CuratorShareForm/PublicationDay/index.js