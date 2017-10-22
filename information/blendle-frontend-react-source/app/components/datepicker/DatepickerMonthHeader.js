import React from 'react';
import moment from 'moment';

export default class DatepickerMonthHeader extends React.Component {
  render() {
    const dayNames = Array(7)
      .fill()
      .map((x, day) => {
        const label = moment()
          .day(day + 1)
          .format('dd')
          .substr(0, 1);
        return (
          <td className="datepicker-dayname" key={day}>
            {label}
          </td>
        );
      });

    return (
      <thead>
        <tr>{dayNames}</tr>
      </thead>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/datepicker/DatepickerMonthHeader.js