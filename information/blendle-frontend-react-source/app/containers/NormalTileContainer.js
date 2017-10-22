import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { memoize } from 'lodash';
import { smartCropImages } from 'config/features';
import AltContainer from 'alt-container';
import Measure from 'react-measure';
import { getManifest } from '../selectors/tiles';
import TilesStore from '../stores/TilesStore';
import ProviderStore from '../stores/ProviderStore';
import NormalTile from '../components/tiles/NormalTile';
import { providerById } from '../selectors/providers';
import { createItemUri } from '../helpers/prettyurl';
import { getFriendNames, getFriendPostsString } from '../helpers/friendNames';
import { getManifestImageHref } from 'selectors/itemImage';

const ALLOWED_ASPECT_RATIO_DIFFERENCE = 5;

const resolverForImages = ({ manifest, width, height }) => `${manifest.id}-w${width}-h${height}`;

const getTileBackground = memoize(({ manifest, width, height }) => {
  const maxAspectRatio = width / height + ALLOWED_ASPECT_RATIO_DIFFERENCE;

  const smartCropOptions = {
    width: Math.round(width * 1.05),
    height: Math.round(height * 1.05),
  };

  return getManifestImageHref(manifest, {
    smartCrop: smartCropImages,
    smartCropOptions,
    criteria: {
      minWidth: width,
      minHeight: height,
      maxAspectRatio,
    },
  });
}, resolverForImages);

const getTileImage = memoize(({ manifest, width }) => {
  const smartCropOptions = {
    width: Math.round(width * 1.05),
  };

  return getManifestImageHref(manifest, {
    smartCrop: smartCropImages,
    smartCropOptions,
    criteria: {
      minWidth: width,
    },
  });
}, resolverForImages);

class ManifestContainer extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
  };

  state = {
    width: -1,
    height: -1,
  };

  _handleMeasure = (dimensions) => {
    this.setState(dimensions);
  };

  // Disable eslint becouse of a false negative
  _renderContainer = ({ tilesState, providerState }) => {
    // eslint-disable-line react/prop-types
    const { itemId } = this.props;

    if (!tilesState.tiles.get(itemId)) {
      return null;
    }

    const manifest = getManifest(tilesState.tiles, itemId);
    const itemDetails = tilesState.tiles.get(itemId);
    const providerId = manifest.provider.id;
    const provider = providerById(providerState, providerId);

    const friendNames = getFriendNames(itemDetails['followed-user-posts']);

    const portraitPhoto = getTileBackground({
      manifest,
      width: this.state.width,
      height: this.state.height,
    });

    const photo =
      !portraitPhoto &&
      getTileImage({
        manifest,
        width: this.state.width,
      });

    return (
      <Measure
        onMeasure={this._handleMeasure}
        whitelist={['width', 'height']}
        includeMargin={false}
      >
        <NormalTile
          body={manifest.body}
          template={provider.templates.tile}
          providerName={provider.name}
          providerId={provider.id}
          itemId={itemId}
          showReadCheckBox={itemDetails.opened && itemDetails.item_purchased}
          readerUrl={createItemUri(manifest)}
          heartText={getFriendPostsString(friendNames, itemDetails.post_count)}
          photo={portraitPhoto || photo}
          isPortrait={!!portraitPhoto}
        />
      </Measure>
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          tilesState: TilesStore,
          providerState: ProviderStore,
        }}
        render={this._renderContainer}
      />
    );
  }
}

export default ManifestContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/NormalTileContainer.js