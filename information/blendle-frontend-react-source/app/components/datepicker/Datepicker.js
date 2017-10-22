import React from 'react';
import PropTypes from 'prop-types';
import MonthHeader from './DatepickerMonthHeader';
import MonthDays from './DatepickerMonthDays';
import moment from 'moment';
import classNames from 'classnames';
import i18n from 'instances/i18n';

export default class Datepicker extends React.Component {
  static propTypes = {
    date: PropTypes.object,
    onSelect: PropTypes.func,
    onChangeMonth: PropTypes.func,
    activeDates: PropTypes.array,
    dateRange: PropTypes.bool,
    fromDate: PropTypes.object,
    toDate: PropTypes.object,
    month: PropTypes.number,
    year: PropTypes.number,
  };

  static defaultProps = {
    date: moment(),
    dateRange: false,
    fromDate: null,
    toDate: null,
    onChangeMonth: () => {},
    onSelect: () => {},
  };

  componentWillMount() {
    const date = moment(this.props.date, 'YYYY-MM-DD');

    this.setState({
      date: this.props.date,
      month: this.props.month || date.month() + 1,
      year: this.props.year || date.year(),
      limitReached: this._limitReached(this.props.date),
    });
  }

  _onNavigateMonth(direction, e) {
    e.preventDefault();

    if (e.target.classList.contains('disabled')) {
      return;
    }

    this._onChangeMonth(direction);
  }

  _onChangeMonth(months) {
    const newDate = moment(this.state.date)
      .add(months, 'month')
      .startOf('month');

    this.setState({
      date: newDate,
      year: newDate.year(),
      month: newDate.month() + 1,
      limitReached: this._limitReached(newDate),
    });

    this.props.onChangeMonth(newDate);
  }

  _onSelectDay(date) {
    this.setState({
      selected: date.format('YYYY-MM-DD'),
    });

    this.props.onSelect(date);
  }

  _limitReached(date) {
    const nextMonth = moment(date)
      .startOf('month')
      .add(1, 'months');
    return nextMonth.isAfter(moment());
  }

  render() {
    const dateString = `${this.state.year}-${this.state.month}-1`;
    const currentMonth = moment(dateString, 'YYYY-MM-DD').format('MMMM, YYYY');

    const nextClasses = classNames({
      'btn-next': true,
      disabled: this.state.limitReached,
    });

    return (
      <div className="v-datepicker s-success">
        <div className="datepicker-header">
          <a href="#" className="btn-previous" onClick={this._onNavigateMonth.bind(this, -1)}>
            {i18n.translate('elements.datepicker.previous_month')}
          </a>

          <a href="#" className={nextClasses} onClick={this._onNavigateMonth.bind(this, 1)}>
            {i18n.translate('elements.datepicker.next_month')}
          </a>

          <p className="current-month">{currentMonth}</p>
        </div>

        <table className="datepicker-body">
          <MonthHeader />
          <MonthDays
            year={this.state.year}
            month={this.state.month}
            selected={this.props.date}
            onSelect={this._onSelectDay.bind(this)}
            activeDates={this.props.activeDates}
            dateRange={this.props.dateRange}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
        </table>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/components/datepicker/Datepicker.js