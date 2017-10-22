import React from 'react';
import PropTypes from 'prop-types';
import Datepicker from 'components/datepicker/Datepicker';
import moment from 'moment';
import { history } from 'byebye';
import _ from 'lodash';
import TypedError from 'helpers/typederror';
import axios from 'axios';

class IssueNavigationCalendarContainer extends React.Component {
  static propTypes = {
    issue: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeDays: [],
    };
  }

  componentDidMount() {
    this._fetchActiveDays(this.props.issue.get('date'))
      .then(activeDays => activeDays.map(activeDay => activeDay.date))
      .then(activeDays => this.setState({ activeDays }));
  }

  _fetchActiveDays(start) {
    const date = moment(start);
    const year = date.year();
    const month = date.month();

    return this._getCalendarForYearMonth(year, month + 1).catch((err) => {
      if (err.status || err.type === 'LinkNotFound') {
        return;
      }
      throw err;
    });
  }

  _onSelectDay(date) {
    this._getCalendarForYearMonth(date.year(), date.month() + 1)
      .then(activeDays =>
        activeDays.find(activeDay => activeDay.date === date.format('YYYY-MM-DD')),
      )
      .then(({ issue }) => {
        const providerId = issue.provider.id;
        history.navigate(`/issue/${providerId}/${issue.id}`, { trigger: true });
      });
  }

  _onChangeMonth(newMonth) {
    this._fetchActiveDays(newMonth)
      .then(activeDays => activeDays.map(activeDay => activeDay.date))
      .then(activeDays => this.setState({ activeDays }));
  }

  _getCalendarForYears() {
    if (this._years) {
      return this._years;
    }

    this._years = axios.get(this.props.issue.getLink('years')).then(response => response.data);

    return this._years;
  }

  _getCalendarForYear(year) {
    if (!this._year) {
      this._year = {};
    }

    if (this._year[year]) {
      return this._year[year];
    }

    this._year[year] = this._getCalendarForYears().then((years) => {
      const yearLink = _.find(years._links.years, {
        title: year.toString(),
      });

      if (!yearLink) {
        throw new TypedError('LinkNotFound');
      }

      return axios.get(yearLink.href).then(response => response.data);
    });

    return this._year[year];
  }

  _getCalendarForYearMonth(year, month) {
    const cacheKey = `${year}-${month}`;
    if (!this._months) {
      this._months = {};
    }

    if (this._months[cacheKey]) {
      return this._months[cacheKey];
    }

    this._months[cacheKey] = this._getCalendarForYear(year)
      .then((data) => {
        const monthLink = _.find(data._links.months, {
          title: month.toString(),
        });

        if (!monthLink) {
          return Promise.resolve([]);
        }

        return axios.get(monthLink.href).then(response =>
          response.data._embedded.issues.map(issue => ({
            date: moment(issue.date).format('YYYY-MM-DD'),
            issue,
          })),
        );
      })
      .catch((err) => {
        if (err.type === 'LinkNotFound') {
          return;
        }
        throw err;
      });

    return this._months[cacheKey];
  }

  render() {
    return (
      <Datepicker
        date={moment(this.props.issue.get('date'))}
        onSelect={this._onSelectDay.bind(this)}
        onChangeMonth={this._onChangeMonth.bind(this)}
        activeDates={this.state.activeDays}
      />
    );
  }
}

export default IssueNavigationCalendarContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/issue/containers/IssueNavigationCalendarContainer.js