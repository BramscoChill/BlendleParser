import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PrintScout from 'printscout';
import { hasSelectedAll } from 'helpers/selectionEvents';
import { getManifest, getItemFromTiles } from 'selectors/tiles';
import { debounce, once } from 'lodash';
import Analytics from 'instances/analytics';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import ItemActions from 'actions/ItemActions';
import RefundActions from 'actions/RefundActions';
import NotificationsActions from 'actions/NotificationsActions';
import { getWordCount } from 'helpers/manifest';
import { refund } from '../helpers/refund';
import AutoRefundContainer from '../containers/AutoRefundContainer';

const printScout = new PrintScout();

export default ComposedComponent =>
  class withAutoRefund extends PureComponent {
    static propTypes = {
      params: PropTypes.shape({
        itemId: PropTypes.string.isRequired,
      }).isRequired,
    };

    componentDidMount() {
      this._afterPrintHandler = printScout.after(this._handlePrint);
      TilesStore.listen(this._tilesStateChanged);
      this._openTime = new Date();
    }

    componentWillUnmount() {
      this._removeSelectAndCopy();
      this._afterPrintHandler.remove();
      TilesStore.unlisten(this._tilesStateChanged);
      this._handleAutoRefund();
    }

    componentWillReceiveProps(nextProps) {
      const { itemId } = nextProps.params;
      if (this.props.params.itemId !== itemId) {
        this._handleAutoRefund();
      }
    }

    _tilesStateChanged = ({ tiles }) => {
      if (tiles) {
        this._createSelectAndCopyListeners(tiles);
      }
    };

    _createSelectAndCopyListeners = once((tiles) => {
      // Seleciton
      this._selectionListener = debounce(() => this._handleSelect(tiles), 400, { leading: true });

      document.addEventListener('selectionchange', this._selectionListener);

      // Copy
      if (document.oncopy !== undefined) {
        document.oncopy = this._handleCopy;
      } else {
        document.addEventListener('copy', this._handleCopy);
      }
    });

    _removeSelectAndCopy() {
      document.oncopy = null;
      document.removeEventListener('copy', this._handleCopy);

      if (this._selectionListener) {
        this._selectionListener.cancel();
      }

      document.removeEventListener('selectionchange', this._selectionListener);
    }

    _handleSelect(tiles) {
      const manifest = getManifest(tiles, ItemStore.getState().selectedItemId);
      const itemWordLength = getWordCount(manifest);
      // if this._hasSelectedAll is true once, it never get false again
      this._hasSelectedAll = this._hasSelectedAll || hasSelectedAll(itemWordLength);
    }

    _handleCopy = () => {
      Analytics.track('Copy');
      ItemActions.afterCopy();
      if (this._hasSelectedAll) {
        ItemActions.afterCopiedAll();
      }
    };

    _handlePrint() {
      ItemActions.afterPrint();
    }

    _handleAutoRefund = () => {
      const { autoRefundable, selectedItemId } = ItemStore.getState();
      const { user } = AuthStore.getState();
      const timeOpen = (new Date().getTime() - this._openTime.getTime()) / 1000;

      if (autoRefundable && !user.isFreeloader()) {
        RefundActions.resetState();

        Analytics.track('Close Item Within X', {
          hasSelectedAll: this._hasSelectedAll || false,
          hasCopied: ItemStore.getState().hasCopiedAll || false,
          time_open: timeOpen,
          item_id: selectedItemId,
        });

        refund('close_within_x');
        this._showAutoRefundNotification();
      }
    };

    _showAutoRefundNotification = () => {
      const { selectedItemId: id } = ItemStore.getState();
      const tile = getItemFromTiles(id, TilesStore.getState());
      const item = { ...tile, id };

      const AutoRefundProps = {
        item,
        isPinned: item.pinned,
        onClose: () => NotificationsActions.hideNotification(`auto-refund-${id}`),
      };

      this._notificationTimeout = setTimeout(() => {
        NotificationsActions.showNotification(
          AutoRefundContainer,
          AutoRefundProps,
          `auto-refund-${id}`,
          { duration: 10000 },
        );
      }, 1000);
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withAutoRefund.js