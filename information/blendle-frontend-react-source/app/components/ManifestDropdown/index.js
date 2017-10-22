import React from 'react';
import { string, bool, shape, number } from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { Dropdown, DropdownOption } from '@blendle/lego';
import DropdownSharingButtonsContainer from 'containers/DropdownSharingButtonsContainer';
import PinButtonContainer from 'modules/timeline/containers/PinButtonContainer';
import Analytics from 'instances/analytics';
import TriggerButton from './TriggerButton';
import ItemDetails from './ItemDetails';
import CSS from './style.scss';

const enhance = compose(
  withState('isOpen', 'setOpen', false),
  withHandlers({
    toggleDropdown: ({ itemId, analytics, setOpen }) => (willBeOpen) => {
      if (willBeOpen) {
        Analytics.track('Open Manifest Dropdown', {
          item: itemId,
          location_in_layout: 'manifest-dropdown',
          ...analytics,
        });
      }

      setOpen(willBeOpen);
    },
  }),
);

/* eslint react/prop-types: ['error', {ignore: ['isOpen', 'toggleDropdown']}] */
function ManifestDropdown({
  itemId,
  analytics,
  itemLength,
  date,
  cappuccinoButton,
  hidePin,
  triggerClassName,
  isOpen, // Comes from HOC
  toggleDropdown, // Comes from HOC
}) {
  return (
    <Dropdown
      onToggle={toggleDropdown}
      isOpen={isOpen}
      className={CSS.dropdown}
      triggerButton={
        <TriggerButton
          isCappuccinoButton={cappuccinoButton}
          isOpen={isOpen}
          className={triggerClassName}
        />
      }
    >
      <div className={CSS.optionsWrapper} data-test-identifier="manifest-dropdown-options">
        {!hidePin && (
          <DropdownOption className={`${CSS.dropdownOption} ${CSS.pinOption}`}>
            <PinButtonContainer analytics={analytics} itemId={itemId} />
          </DropdownOption>
        )}
        <DropdownSharingButtonsContainer
          analytics={analytics}
          itemId={itemId}
          className={CSS.sharingButtons}
          buttonClassName={CSS.shareButton}
        />
        <ItemDetails itemLength={itemLength} date={date} />
      </div>
    </Dropdown>
  );
}

ManifestDropdown.propTypes = {
  itemId: string.isRequired,
  analytics: shape({
    internal_location: string,
  }),
  itemLength: shape({
    words: number.isRequired,
  }).isRequired,
  date: string.isRequired,
  cappuccinoButton: bool,
  hidePin: bool,
  triggerClassName: string,
};

ManifestDropdown.defaultProps = {
  cappuccinoButton: false,
  hidePin: false,
  analytics: {},
  triggerClassName: '',
};

export const ManifestDropdownComponent = ManifestDropdown;
export default enhance(ManifestDropdown);



// WEBPACK FOOTER //
// ./src/js/app/components/ManifestDropdown/index.js