import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import classNames from 'classnames';
import { MAX_TILE_HEIGHT, HOME_ROUTE } from 'app-constants';
import features, { smartCropImages } from 'config/features';
import { PremiumLabelsOnCards, PremiumLabelsOnCardsLabels } from 'config/runningExperiments';
import BrowserEnvironment from 'instances/browser_environment';
import { getManifestBody } from 'helpers/manifest';
import { renderItemContent } from 'helpers/renderItemContent';
import { getPortraitTileTemplate, getDefaultTileTemplate } from 'helpers/providerHelpers';
import { createItemUri } from 'helpers/prettyurl';
import { assignExperimentVariant } from 'helpers/experiments';
import TilesStore from 'stores/TilesStore';
import PremiumSubscriptionStore from 'stores/PremiumSubscriptionStore';
import ExperimentsStore from 'stores/ExperimentsStore';
import AuthStore from 'stores/AuthStore';
import { isProviderPortraitImageCapable, prefillSelector, providerById } from 'selectors/providers';
import { getManifestImageHref } from 'selectors/itemImage';
import { getManifest } from 'selectors/tiles';
import { isBundleItem } from 'selectors/item';
import ItemPriceContainer from 'containers/ItemPriceContainer';
import Link from 'components/Link';
import PremiumLabel from 'components/PremiumLabel';
import DefaultManifestContent from './components/DefaultManifestContent';
import PortraitManifestContent from './components/PortraitManifestContent';
import ManifestDropdownWrapper from './ManifestDropdownWrapper';

class ManifestContainer extends PureComponent {
  static propTypes = {
    analytics: PropTypes.object.isRequired,
    hideImage: PropTypes.bool,
    className: PropTypes.string,
    onNavigate: PropTypes.func,
    tileHeight: PropTypes.number,
    itemId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    hideImage: false,
    className: 'v-manifest item-manifest item',
    onNavigate: () => {},
  };

  constructor(props) {
    super(props);
    this._renderedManifestType = null;
  }

  componentWillMount() {
    this.portraitImage = this._getPortraitImage();
  }

  _setManifestType = (type) => {
    this._renderedManifestType = type;
  };

  _getPortraitImageDimensions() {
    const isMobile = BrowserEnvironment.isMobile();
    const width = isMobile ? window.innerWidth : 310;

    if (isMobile) {
      return {
        width,
        height: 368, // On mobile the manifest content is a fixed height of 368px
      };
    }

    const { tileHeight } = this.props;
    const height = tileHeight ? Math.min(tileHeight, MAX_TILE_HEIGHT) : null; // If we don't know the tile height it is estimated

    return {
      width,
      height,
    };
  }

  _getPortraitImage() {
    const { itemId, hideImage } = this.props;
    const manifest = getManifest(TilesStore.getState().tiles, itemId);
    const isPortraitImgCapable = prefillSelector(isProviderPortraitImageCapable)(
      manifest.provider.id,
    );

    if (!features.portraitImageManifest || !isPortraitImgCapable || hideImage) {
      return null;
    }

    const isMobile = BrowserEnvironment.isMobile();
    const maxAspectRatio = isMobile ? 1.1 : 0.8;
    const portraitImageDimension = this._getPortraitImageDimensions();

    const smartCropOptions = {
      width: portraitImageDimension.width,
      widthInterval: isMobile, // On desktop the width is a fixed value
      height: portraitImageDimension.height,
      heightInterval: !isMobile && portraitImageDimension.height !== MAX_TILE_HEIGHT, // On mobile the height is a fixed value
    };

    return getManifestImageHref(manifest, {
      smartCrop: smartCropImages,
      smartCropOptions,
      criteria: {
        minWidth: portraitImageDimension.width * 0.8,
        minHeight: portraitImageDimension.height * 0.7,
        hasCredits: true,
        maxAspectRatio,
      },
    });
  }

  _renderProvider(provider) {
    // eslint-disable-line class-methods-use-this
    return (
      <Link href={`/issue/${provider.id}`} className="item-provider">
        {provider.name}
      </Link>
    );
  }

  _renderManifestContent(manifest, provider) {
    const defaultManifestProps = {
      analytics: this.props.analytics,
      setRenderedType: this._setManifestType,
      itemURI: `/${createItemUri(manifest)}`,
    };

    if (this.portraitImage) {
      const itemContent = renderItemContent(
        getManifestBody(manifest),
        getPortraitTileTemplate(provider),
      );

      return (
        <PortraitManifestContent
          {...defaultManifestProps}
          itemContent={itemContent}
          onOpen={this.props.onNavigate}
          portraitImage={this.portraitImage}
        />
      );
    }

    const itemContent = renderItemContent(
      getManifestBody(manifest),
      getDefaultTileTemplate(provider),
    );

    return (
      <DefaultManifestContent
        {...defaultManifestProps}
        itemContent={itemContent}
        onOpen={this.props.onNavigate}
        hideImage={this.props.hideImage}
        manifest={manifest}
      />
    );
  }

  _renderPremiumLabel(experimentsState, subscription, tile, user) {
    // eslint-disable-line class-methods-use-this
    if (subscription && isBundleItem(tile)) {
      const variant = assignExperimentVariant(PremiumLabelsOnCards, experimentsState, user);
      const style = {
        position: 'absolute',
        right: '15px',
        top: '9px',
        marginRight: '36px',
      };

      return variant === PremiumLabelsOnCardsLabels ? (
        <a href={HOME_ROUTE}>
          <PremiumLabel style={style} />
        </a>
      ) : null;
    }

    return null;
  }

  _renderContainer = ({ tilesState, premiumSubscriptionState, experimentsState, authState }) => {
    const { itemId, analytics } = this.props;
    const manifest = getManifest(tilesState.tiles, itemId);
    const tile = tilesState.tiles.get(itemId);
    const providerId = manifest.provider.id;
    const provider = prefillSelector(providerById)(providerId);
    const { subscription } = premiumSubscriptionState;
    const { user } = authState;

    const className = classNames(this.props.className, 's-success', `provider-${provider.id}`);

    return (
      <div className={className}>
        <div className="manifest-top-bar">
          {this._renderProvider(provider)}
          {this._renderPremiumLabel(experimentsState, subscription, tile, user)}
          <ItemPriceContainer itemId={itemId} className="item-price-container" />
          <ManifestDropdownWrapper itemId={manifest.id} analytics={analytics} />
        </div>
        {this._renderManifestContent(manifest, provider)}
      </div>
    );
  };

  render() {
    return (
      <AltContainer
        stores={{
          tilesState: TilesStore,
          premiumSubscriptionState: PremiumSubscriptionStore,
          experimentsState: ExperimentsStore,
          authState: AuthStore,
        }}
        render={this._renderContainer}
      />
    );
  }
}

export default ManifestContainer;



// WEBPACK FOOTER //
// ./src/js/app/containers/ManifestContainer/index.js