import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { memoize } from 'lodash';
import withRouter from 'react-router/lib/withRouter';
import AltContainer from 'alt-container';
import constants from 'app-constants';
import ItemActions from 'actions/ItemActions';
import NotificationsActions from 'actions/NotificationsActions';
import ItemStore from 'stores/ItemStore';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import ProviderStore from 'stores/ProviderStore';
import { providerById } from 'selectors/providers';
import { getManifest } from 'selectors/tiles';
import TopBar from '../components/TopBar';

const getAnalytics = memoize(providerId => ({
  location_in_layout: 'topbar',
  provider_id: providerId,
}));

const isMobalDialogOpen = () => {
  const target = document.getElementById('dialog-portal');
  return target && target.children.length > 0;
};

class TopBarContainer extends PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keyup', this._onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this._onKeyUp);
  }

  _onClose = () => {
    setTimeout(() => {
      const { returnUrl, selectedItemId } = ItemStore.getState();

      NotificationsActions.hideNotification(`restore-paragraph-${selectedItemId}`);

      this.props.router.push(returnUrl);
    });
  };

  _onKeyUp = (e) => {
    const { activeImage } = ItemStore.getState();
    const isImageZoomed = !!activeImage;
    if (e.keyCode === constants.keyCode.ESC && !isImageZoomed && !isMobalDialogOpen()) {
      this._onClose();
    }
  };

  _onPinItem = () => {
    const { selectedItemId } = ItemStore.getState();
    const { user } = AuthStore.getState();
    const { tiles } = TilesStore.getState();
    const tile = tiles.get(selectedItemId);
    const manifest = getManifest(tiles, selectedItemId);

    const toggle = !tile.pinned;
    ItemActions.pinItem(user, tile, toggle, getAnalytics(manifest.provider.id));
  };

  // eslint-disable-next-line react/prop-types
  _renderTopBar = ({ itemState, tilesState, providerState }) => {
    const {
      selectedItemId,
      readingPercentage,
      maxReadingPercentage,
      scrollPixelsFromTop,
    } = itemState;
    const { tiles } = tilesState;
    const tile = tiles.get(selectedItemId);

    if (!tile) {
      return null;
    }

    const { provider: { id: providerId } } = getManifest(tiles, selectedItemId);
    const provider = providerById(providerState, providerId);

    return (
      <TopBar
        onClose={this._onClose}
        hasReachedEnd={maxReadingPercentage >= 100}
        percentageRead={readingPercentage}
        analytics={getAnalytics(providerId)}
        provider={provider}
        item={tile}
        scrolledIntoItem={scrollPixelsFromTop > 100}
        isPinned={tile.pinned}
        pinItem={this._onPinItem}
      />
    );
  };

  render() {
    return (
      <AltContainer
        render={this._renderTopBar}
        stores={{
          itemState: ItemStore,
          tilesState: TilesStore,
          providerState: ProviderStore,
        }}
      />
    );
  }
}

export default withRouter(TopBarContainer);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/TopBarContainer.js