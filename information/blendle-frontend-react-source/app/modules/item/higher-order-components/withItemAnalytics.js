import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ItemStore from 'stores/ItemStore';
import TilesStore from 'stores/TilesStore';
import ModuleNavigationStore from 'stores/ModuleNavigationStore';
import Analytics from 'instances/analytics';
import { history } from 'byebye';
import { removeTrailingSlash } from 'helpers/url';

function trackOpenItem(tile) {
  const navigationState = ModuleNavigationStore.getState().analytics[
    `${removeTrailingSlash(history.fragment)}`
  ];

  const analytics = {
    referrer: document.referrer,
    type: 'deeplink',
    incrementReads: true,
    ...navigationState,
  };

  Analytics.trackItemEvent(tile, analytics);
}

function leaveArticleAnalytics(itemId) {
  const { maxReadingPercentage, error } = ItemStore.getState();

  if (!error) {
    Analytics.track('Close Item', {
      content_shown_percent: maxReadingPercentage,
      item_id: itemId,
    });
  }
}

export default ComposedComponent =>
  class withItemAnalytics extends PureComponent {
    static propTypes = {
      params: PropTypes.object.isRequired,
    };

    _alreadyTrackedItemIds = null;
    _endOfContentTracked = null;

    componentDidMount() {
      ItemStore.listen(this._shouldTrackOpenItem);
      ItemStore.listen(this._shouldTrackEndOfContent);
      TilesStore.listen(this._shouldTrackOpenItem);
    }

    componentWillUnmount() {
      const { selectedItemId } = ItemStore.getState();
      leaveArticleAnalytics(selectedItemId);

      ItemStore.unlisten(this._shouldTrackOpenItem);
      ItemStore.unlisten(this._shouldTrackEndOfContent);
      TilesStore.unlisten(this._shouldTrackOpenItem);
    }

    componentWillReceiveProps(nextProps) {
      const { itemId } = nextProps.params;
      if (this.props.params.itemId !== itemId) {
        leaveArticleAnalytics(this.props.params.itemId);
      }
    }

    componentDidUpdate() {
      this._shouldTrackOpenItem();
    }

    _shouldTrackEndOfContent = ({ selectedItemId, maxReadingPercentage }) => {
      if (maxReadingPercentage === 100 && this._endOfContentTracked !== selectedItemId) {
        this._endOfContentTracked = selectedItemId;
        Analytics.track('Item Content End Reached', { item_id: selectedItemId });
      }
    };

    _shouldTrackOpenItem = () => {
      const { tiles } = TilesStore.getState();
      const { selectedItemId, error, acquisitionError, content } = ItemStore.getState();
      const tile = tiles.get(selectedItemId);

      if (
        tile &&
        this._alreadyTrackedItemIds !== selectedItemId &&
        !error &&
        !acquisitionError &&
        content.data
      ) {
        this._alreadyTrackedItemIds = selectedItemId;
        trackOpenItem(tile);
      }
    };

    render() {
      return <ComposedComponent {...this.props} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withItemAnalytics.js