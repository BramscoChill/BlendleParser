import React from 'react';
import { bool, func, string } from 'prop-types';
import { ArrowDownIcon } from '@blendle/lego';
import classNames from 'classnames';
import CSS from './style.scss';

function TriggerButton({ isOpen, isCappuccinoButton, onClick, className }) {
  const iconClasses = classNames(CSS.arrowIcon, {
    [CSS.isOpen]: isOpen,
    [CSS.cappucino]: isCappuccinoButton,
  });

  return (
    <button
      data-test-identifier="manifest-dropdown-button"
      onClick={onClick}
      className={classNames(CSS.triggerButton, className)}
    >
      <ArrowDownIcon className={iconClasses} />
    </button>
  );
}

TriggerButton.propTypes = {
  onClick: func,
  isOpen: bool,
  isCappuccinoButton: bool,
  className: string,
};

TriggerButton.defaultProps = {
  onClick: () => {},
  isOpen: false,
  isCappuccinoButton: false,
  className: '',
};

export default TriggerButton;



// WEBPACK FOOTER //
// ./src/js/app/components/ManifestDropdown/TriggerButton/index.js