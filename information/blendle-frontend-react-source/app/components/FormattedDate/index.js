import React from 'react';
import { string } from 'prop-types';
import moment from 'moment';
import { memoize } from 'lodash';

const formatDate = memoize(
  (date, format) => moment(date).format(format),
  (date, format) => `${date}:${format}`,
);

function FormattedDate({ date, format, component: Component, ...props }) {
  return <Component {...props}>{formatDate(date, format)}</Component>;
}

FormattedDate.propTypes = {
  date: string.isRequired,
  format: string.isRequired,
  component: string,
};

FormattedDate.defaultProps = {
  component: 'span',
};

export default FormattedDate;



// WEBPACK FOOTER //
// ./src/js/app/components/FormattedDate/index.js