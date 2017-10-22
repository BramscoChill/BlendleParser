import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProviderImage from 'components/ProviderImage';
import { getDefaultTileTemplate } from 'helpers/providerHelpers';
import { renderItemContent } from 'helpers/renderItemContent';
import { getManifestBody } from 'helpers/manifest';

class DeeplinkManifest extends PureComponent {
  static propTypes = {
    manifest: PropTypes.object.isRequired,
  };

  render() {
    const { manifest } = this.props;
    const provider = manifest.get('provider');

    const itemContent = renderItemContent(
      getManifestBody(manifest),
      getDefaultTileTemplate(provider),
    );

    return (
      <div className={`item item-content provider-${provider.id}`}>
        <ProviderImage className="item-provider" provider={provider} />
        {itemContent}
      </div>
    );
  }
}

export default DeeplinkManifest;



// WEBPACK FOOTER //
// ./src/js/app/modules/deeplink/components/DeeplinkManifest.js