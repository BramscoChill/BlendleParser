import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function getTimeAgo(date) {
  const startOfDay = moment().startOf('day');
  const publishDay = moment(date).startOf('day');
  const publshedToday = startOfDay.diff(publishDay) === 0;
  return publshedToday ? startOfDay.calendar() : publishDay.calendar();
}

class SearchContextToast extends PureComponent {
  static PropTypes = {
    term: PropTypes.string.isRequired,
    snippet: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  };

  render() {
    const { term, snippet, date } = this.props;

    return (
      <div className="v-toast v-results-toast">
        <div className="icon-search" />
        <div className="title">{term}</div>
        <div className="timeago">{getTimeAgo(date)}</div>
        <div className="snippet" dangerouslySetInnerHTML={{ __html: snippet }} />
      </div>
    );
  }
}

export default SearchContextToast;



// WEBPACK FOOTER //
// ./src/js/app/modules/search/components/SearchContextToast.js