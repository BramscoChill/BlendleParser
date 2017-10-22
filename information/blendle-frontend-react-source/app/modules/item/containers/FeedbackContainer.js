import React, { PureComponent } from 'react';
import ItemFeedback from '../components/ItemFeedback';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import AltContainer from 'alt-container';
import ItemPreferenceActions from 'actions/ItemPreferenceActions';
import ItemPreferenceStore from 'stores/ItemPreferenceStore';
import { STATUS_INITIAL, STATUS_PENDING, STATUS_OK } from 'app-constants';
import { isBundleItem } from 'selectors/item';

class FeedbackContainer extends PureComponent {
  componentDidMount() {
    const { user } = AuthStore.getState();
    const { itemId } = this.props;

    ItemPreferenceActions.fetchPreference.defer(user.id, itemId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.itemId !== nextProps.itemId) {
      const { user } = AuthStore.getState();
      ItemPreferenceActions.fetchPreference.defer(user.id, this.props.itemId);
    }
  }

  _onDislike = (e) => {
    e.preventDefault();
    const { user } = AuthStore.getState();

    ItemPreferenceActions.sendNegativePreference(user.id, this.props.itemId);
  };

  _onRevertDislike = (e) => {
    e.preventDefault();
    const { user } = AuthStore.getState();

    ItemPreferenceActions.deleteNegativePreference(user.id, this.props.itemId);
  };

  // eslint-disable-next-line react/prop-types
  _renderFeedback = ({ tilesState, itemPreferenceState, authState }) => {
    const { itemId } = this.props;
    const { tiles } = tilesState;
    const { user } = authState;
    const { preferences } = itemPreferenceState;
    const tile = tiles.get(itemId);
    const preference = preferences[itemId];

    if (
      tile &&
      !tile.refundable &&
      isBundleItem(tile) &&
      user.hasActivePremiumSubscription() &&
      preference &&
      preference.status !== STATUS_INITIAL
    ) {
      return (
        <ItemFeedback
          onDislike={this._onDislike}
          onRevertDislike={this._onRevertDislike}
          loading={preference.status === STATUS_PENDING}
          success={preference.status === STATUS_OK && !!preference.data}
        />
      );
    }

    return null;
  };

  render() {
    return (
      <AltContainer
        render={this._renderFeedback}
        stores={{
          itemPreferenceState: ItemPreferenceStore,
          tilesState: TilesStore,
          authState: AuthStore,
        }}
      />
    );
  }
}

export default FeedbackContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/FeedbackContainer.js