import PropTypes from 'prop-types';
import { STATUS_INITIAL, STATUS_ERROR, STATUS_OK, STATUS_PENDING } from 'app-constants';

export const status = PropTypes.oneOf([STATUS_INITIAL, STATUS_ERROR, STATUS_OK, STATUS_PENDING]);



// WEBPACK FOOTER //
// ./src/js/app/libs/propTypes.js