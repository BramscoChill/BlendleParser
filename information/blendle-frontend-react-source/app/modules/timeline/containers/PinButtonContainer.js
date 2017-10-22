import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PinButton from 'components/buttons/PinButton';
import ItemActions from 'actions/ItemActions';
import TilesStore from 'stores/TilesStore';
import AuthStore from 'stores/AuthStore';
import AltContainer from 'alt-container';
import { getPin } from 'selectors/tiles';

class PinButtonContainer extends PureComponent {
  static propTypes = {
    analytics: PropTypes.object.isRequired,
    itemId: PropTypes.string.isRequired,
  };

  _onChange = () => {
    const pinned = !getPin(TilesStore.getState().tiles, this.props.itemId);
    const item = TilesStore.getState().tiles.get(this.props.itemId);
    ItemActions.pinItem(AuthStore.getState().user, item, pinned, this.props.analytics);
  };

  _renderPinButton = ({ tilesState }) => {
    const pinned = getPin(tilesState.tiles, this.props.itemId);

    return <PinButton marked={pinned} onChange={() => this._onChange()} showText />;
  };

  render() {
    return <AltContainer stores={{ tilesState: TilesStore }} render={this._renderPinButton} />;
  }
}

export default PinButtonContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/timeline/containers/PinButtonContainer.js