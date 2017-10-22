import React from 'react';
import { arrayOf, shape, string, func } from 'prop-types';
import { Dropdown, DropdownOption, DotsIcon } from '@blendle/lego';
import CSS from './style.scss';

function SectionContextMenuButton() {
  return (
    <div className={CSS.icon}>
      <DotsIcon />
    </div>
  );
}

function SectionContextMenu({ options, onClickDropdownOption, onToggleDropdown }) {
  return (
    <div className={CSS.contextMenu}>
      <Dropdown
        triggerButton={SectionContextMenuButton}
        className={CSS.sectionContextDropdown}
        onToggle={onToggleDropdown}
        closeOnItemClicked
      >
        {options.map(option => (
          <DropdownOption key={option.action} onClick={onClickDropdownOption(option)}>
            <span
              className={CSS.optionContent}
              dangerouslySetInnerHTML={{ __html: option.label }}
            />
          </DropdownOption>
        ))}
      </Dropdown>
    </div>
  );
}

SectionContextMenu.propTypes = {
  options: arrayOf(shape({ action: string, label: string })).isRequired,
  onClickDropdownOption: func.isRequired,
  onToggleDropdown: func.isRequired,
};

export default SectionContextMenu;



// WEBPACK FOOTER //
// ./src/js/app/modules/sectionsPage/components/SectionContextMenu/index.js