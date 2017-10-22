import React from 'react';
import PropTypes from 'prop-types';
import CSS from './style.scss';

const ShareButton = ({ children, ...props }) => (
  <button className={CSS.shareButton} {...props}>
    {children}
  </button>
);
ShareButton.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ShareButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/components/SelectedShareTooltip/ShareButton/index.js