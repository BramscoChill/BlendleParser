import altConnect from 'higher-order-components/altConnect';
import { getManifest } from 'selectors/tiles';
import ManifestDropdown from 'components/ManifestDropdown';
import TilesStore from 'stores/TilesStore';

function mapStateToProps(
  { tilesState },
  { itemId, cappuccinoButton, analytics, hidePin, triggerClassName },
) {
  const manifest = getManifest(tilesState.tiles, itemId);

  return {
    itemId,
    cappuccinoButton,
    date: manifest.date,
    itemLength: manifest.length,
    analytics,
    hidePin,
    triggerClassName,
  };
}

mapStateToProps.stores = { TilesStore };

export default altConnect(mapStateToProps)(ManifestDropdown);



// WEBPACK FOOTER //
// ./src/js/app/containers/ManifestDropdownContainer.js