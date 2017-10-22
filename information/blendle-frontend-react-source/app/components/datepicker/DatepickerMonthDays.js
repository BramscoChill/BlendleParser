import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

export default class DatepickerMonthDays extends React.Component {
  static propTypes = {
    year: PropTypes.number,
    month: PropTypes.number,
    selected: PropTypes.object,
    onSelect: PropTypes.func,
    dateRange: PropTypes.bool,
    activeDates: PropTypes.array,
    fromDate: PropTypes.object,
    toDate: PropTypes.object,
  };

  static defaultProps = {
    year: 0,
    month: 0,
    selected: moment(),
    activeDates: [],
    dateRange: false,
    fromDate: null,
    toDate: null,
  };

  _onClickDay(e) {
    e.preventDefault();

    if (!e.target.classList.contains('active')) {
      return;
    }

    const date = e.target.getAttribute('data-date');
    this.props.onSelect(moment(date, 'YYYY-MM-DD'));
  }

  _getWeeksInMonth(day) {
    const start = day.clone().startOf('month');
    const end = day.clone().endOf('month');

    return Math.ceil((end.date() + start.weekday()) / 7);
  }

  _getAllDays() {
    const daysInPrevousMonth = this._getPreviousDaysAmount();
    const day = moment(`${this.props.year}-${this.props.month}-1`, 'YYYY-MM-DD');
    const weeks = this._getWeeksInMonth(day.clone());
    day.subtract(daysInPrevousMonth + 1, 'days');

    return Array(weeks * 7)
      .fill()
      .map(() => day.add(1, 'days').clone());
  }

  _getPreviousDaysAmount() {
    let weekday = moment(`${this.props.year}-${this.props.month}-1`, 'YYYY-MM-DD').day() - 1;

    // Our weeks start on monday
    if (weekday === -1) {
      weekday = 6;
    }

    return weekday;
  }

  _renderDay(date) {
    const formattedDate = date.format('YYYY-MM-DD');

    const otherMonth = date.month() + 1 !== this.props.month;
    const selected = this.props.selected.format('YYYY-MM-DD') === formattedDate && !otherMonth;

    let active;
    if (!this.props.dateRange) {
      active = this.props.activeDates.indexOf(formattedDate) !== -1 && !otherMonth;
    } else {
      const fromDate = this.props.fromDate;
      const toDate = this.props.toDate;

      if (
        (!fromDate || date.isAfter(fromDate) || date.isSame(fromDate)) &&
        (!toDate || date.isBefore(toDate))
      ) {
        active = true;
      } else if (
        (this.props.selected.isSame(toDate) && date.isAfter(toDate)) ||
        (this.props.selected.isSame(fromDate) && date.isBefore(fromDate))
      ) {
        // A limit is allowed to exceed its own limit (e.g. the new toDate is allowed to be after
        // the current toDate)
        active = true;
      }
    }

    const dayClasses = classNames({
      'datepicker-day': true,
      'other-month': otherMonth,
      's-selected': selected,
      active,
    });

    return (
      <td
        className={dayClasses}
        data-date={formattedDate}
        key={formattedDate}
        onClick={this._onClickDay.bind(this)}
      >
        {date.date()}
      </td>
    );
  }

  render() {
    // Devide all visible days into 6 weeks
    const days = this._getAllDays();
    const activeDate = moment(`${this.props.year}-${this.props.month}-1`, 'YYYY-MM-DD');
    const weeksInMonth = this._getWeeksInMonth(activeDate);

    const weeks = Array(weeksInMonth)
      .fill()
      .map(() => days.splice(0, 7).map(day => this._renderDay(day)));

    return <tbody>{weeks.map((week, i) => <tr key={i}>{week}</tr>)}</tbody>;
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/datepicker/DatepickerMonthDays.js