import React from 'react';
import { string, bool } from 'prop-types';
import classNames from 'classnames';
import CSS from './style.scss';

function SidebarButton({ className, isCollapsed, ...props }) {
  const buttonClassName = classNames(CSS.button, {
    [CSS.isOpen]: !isCollapsed,
    [CSS.hamburger]: isCollapsed,
    [CSS.arrow]: !isCollapsed,
    [className]: className,
  });

  return (
    <div className={CSS.container}>
      <div className={buttonClassName} {...props} />
    </div>
  );
}

SidebarButton.propTypes = {
  isCollapsed: bool.isRequired,
  className: string,
};

SidebarButton.defaultProps = {
  className: '',
};

export default SidebarButton;



// WEBPACK FOOTER //
// ./src/js/app/modules/settings/components/SidebarButton/index.js