import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'components/dialogues/Dialogue';
import DatepickerRangeForm from 'components/datepicker/DateRangeForm';
import DatepickerView from 'components/datepicker/Datepicker';
import moment from 'moment';

function isValidInput(fromDate, toDate) {
  return fromDate.isSame(toDate) || fromDate.isBefore(toDate);
}

function getInitialState(props) {
  const state = {};
  if (props.fromDate) {
    state.fromDate = moment(props.fromDate, 'YYYY-MM-DD');
  } else {
    state.fromDate = moment().subtract(1, 'month');
  }

  if (props.toDate) {
    state.toDate = moment(props.toDate, 'YYYY-MM-DD');
  } else {
    state.toDate = moment();
  }

  state.activeDateField = 'from';
  state.date = state.fromDate;

  return state;
}

export default class DateRangeContainer extends React.Component {
  static propTypes = {
    fromDate: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    toDate: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    // @todo: WTF?
    this.state = getInitialState(props);
  }

  _onSelectDate(date) {
    if (this.state.activeDateField === 'from') {
      this.setState({
        fromDate: date,
        activeDateField: 'to',
        date: this.state.toDate,
      });
    } else {
      this.setState({
        toDate: date,
        date,
      });
    }
  }

  _onChangeFrom(e, value) {
    const valueContainsLetters = /[a-zA-Z]/.test(value);
    const newFromDate = moment(value, 'l');
    const fromDateIsValid = newFromDate.isValid() && !valueContainsLetters;

    if (fromDateIsValid) {
      this.setState({
        fromDate: newFromDate,
        date: newFromDate,
      });
    }
  }

  _onChangeTo(e, value) {
    const valueContainsLetters = /[a-zA-Z]/.test(value);
    const newToDate = moment(value, 'l');
    const toDateIsValid = newToDate.isValid() && !valueContainsLetters;

    if (toDateIsValid) {
      this.setState({
        toDate: newToDate,
        date: newToDate,
      });
    }
  }

  _onFocusFrom() {
    this.setState({
      activeDateField: 'from',
      date: this.state.fromDate,
    });
  }

  _onFocusTo() {
    this.setState({
      activeDateField: 'to',
      date: this.state.toDate,
    });
  }

  render() {
    const { fromDate, toDate } = this.state;

    return (
      <Dialog className="v-daterange" onClose={this.props.onClose}>
        <div className="pane">
          <div>
            <DatepickerRangeForm
              fromDate={fromDate}
              toDate={toDate}
              onFocusFrom={this._onFocusFrom.bind(this)}
              onFocusTo={this._onFocusTo.bind(this)}
              onChangeFrom={this._onChangeFrom.bind(this)}
              onChangeTo={this._onChangeTo.bind(this)}
              disabled={!isValidInput(fromDate, toDate)}
              activeField={this.state.activeDateField}
              onSubmit={this.props.onSubmit}
            />
          </div>
          <div>
            <DatepickerView
              date={this.state.date}
              fromDate={fromDate}
              toDate={toDate}
              onSelect={this._onSelectDate.bind(this)}
              dateRange
            />
          </div>
        </div>
      </Dialog>
    );
  }
}



// WEBPACK FOOTER //
// ./src/js/app/containers/DateRangeContainer.js