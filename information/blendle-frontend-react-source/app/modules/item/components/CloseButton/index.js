import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CloseIcon } from '@blendle/lego';
import CSS from './style.scss';

const CloseButton = ({ className, ...props }) => (
  <button className={classNames(CSS.closeButton, className)} {...props}>
    <CloseIcon className={CSS.icon} />
  </button>
);
CloseButton.propTypes = {
  className: PropTypes.string,
};
CloseButton.defaultProps = {
  className: '',
};

export default CloseButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/CloseButton/index.js