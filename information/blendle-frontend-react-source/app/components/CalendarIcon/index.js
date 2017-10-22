import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSS from './CalendarIcon.scss';

const CalendarIcon = ({ className, daysLeft }) => {
  const containerClasses = classnames(className, CSS.container);
  const daysCopy = daysLeft > 1 ? 'dagen' : 'dag';

  return (
    <div className={containerClasses}>
      <span className={CSS.header}>nog</span>
      <span className={CSS.days}>{daysLeft}</span>
      <span className={CSS.footer}>{daysCopy}</span>
    </div>
  );
};

CalendarIcon.propTypes = {
  className: PropTypes.string,
  daysLeft: PropTypes.number,
};

export default CalendarIcon;



// WEBPACK FOOTER //
// ./src/js/app/components/CalendarIcon/index.js