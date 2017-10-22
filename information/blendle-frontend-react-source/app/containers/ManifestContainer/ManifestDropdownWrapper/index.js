import React from 'react';
import { string, shape } from 'prop-types';
import ManifestDropdownContainer from 'containers/ManifestDropdownContainer';
import CSS from './style.scss';

function ManifestDropdownWrapper({ itemId, analytics }) {
  return (
    <div className={CSS.manifestDropdownWrapper}>
      <ManifestDropdownContainer itemId={itemId} analytics={analytics} cappuccinoButton />
    </div>
  );
}

ManifestDropdownWrapper.propTypes = {
  itemId: string.isRequired,
  analytics: shape({
    internal_location: string.isRequired,
  }).isRequired,
};

export default ManifestDropdownWrapper;



// WEBPACK FOOTER //
// ./src/js/app/containers/ManifestContainer/ManifestDropdownWrapper/index.js