import React, { PureComponent } from 'react';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import NotificationsActions from 'actions/NotificationsActions';
import ItemNotInBundleNotification from 'components/notifications/ItemNotInBundleNotification';
import FreeSocialReadNotification from 'components/notifications/FreeSocialReadNotification';
import { getTileManifest } from 'selectors/tiles';
import { hasActiveSubscription } from 'selectors/user';
import { isBundleItem } from 'selectors/item';
import { history } from 'byebye';
import { PARTNER_SHARERS } from 'app-constants';
import { get } from 'lodash';

export default ComposedComponent =>
  class withItemNotifications extends PureComponent {
    _notificationShownId = null;
    _notificationTimeout = null;

    componentDidMount() {
      ItemStore.listen(this._shouldShowNotification);
      TilesStore.listen(this._shouldShowNotification);
    }

    componentWillUnmount() {
      ItemStore.unlisten(this._shouldShowNotification);
      TilesStore.unlisten(this._shouldShowNotification);
      clearTimeout(this._notificationTimeout);
    }

    _shouldShowNotification = () => {
      const { tiles } = TilesStore.getState();
      const {
        selectedItemId,
        justAcquired,
        acquisition,
        acquiredWithSharer,
      } = ItemStore.getState();
      const tile = tiles.get(selectedItemId);
      if (!tile) {
        return;
      }

      const { user } = AuthStore.getState();
      const isFreeSocialReadSharedFromUser =
        get(acquisition, 'purchase_origin') === 'social' &&
        !PARTNER_SHARERS.includes(acquiredWithSharer);
      const manifest = getTileManifest(tile);
      const hasProviderSusbcription = hasActiveSubscription(user, manifest.provider.id);

      if (this._notificationShownId !== selectedItemId) {
        if (
          tile &&
          !isBundleItem(tile) &&
          justAcquired &&
          user.hasActivePremiumSubscription() &&
          !hasProviderSusbcription &&
          !isFreeSocialReadSharedFromUser
        ) {
          this._showItemNotInBundleNotification(tile, selectedItemId);
        } else if (justAcquired && isFreeSocialReadSharedFromUser) {
          this._showFreeSocialReadNotification(selectedItemId);
        }
      }
    };

    _showItemNotInBundleNotification(tile, id) {
      this._notificationShownId = id;
      const notificationId = `item-bundle-notification-${id}`;

      const notificationProps = {
        price: tile.price / 100,
        onClick: () => {
          NotificationsActions.hideNotification(notificationId);
          history.navigate(`${window.location.pathname}/refund`, { trigger: true });
        },
      };

      this._notificationTimeout = setTimeout(() => {
        NotificationsActions.showNotification(
          ItemNotInBundleNotification,
          notificationProps,
          notificationId,
        );
      }, 2000);
    }

    _showFreeSocialReadNotification(id) {
      this._notificationShownId = id;
      const notificationId = `item-free-social-read-${id}`;
      const notificationProps = {
        onClick: () => NotificationsActions.hideNotification(notificationId),
      };

      this._notificationTimeout = setTimeout(() => {
        NotificationsActions.showNotification(
          FreeSocialReadNotification,
          notificationProps,
          notificationId,
        );
      }, 2000);
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withItemNotifications.js