import React, { PureComponent } from 'react';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import AltContainer from 'alt-container';
import JustEnoughBalanceDialog from 'components/dialogues/JustEnoughBalance';

class JustEnoughBalanceContainer extends PureComponent {
  state = {
    closed: false,
  };

  _onClose = () => {
    this.setState({ closed: true });
  };

  // eslint-disable-next-line react/prop-types
  _renderAlmostOutOfBalance = ({ authState, itemState }) => {
    const { justAcquired, acquisition } = itemState;
    const { user } = authState;
    const balance = user.getBalance();

    if (
      !user.isFreeloader() &&
      justAcquired &&
      balance < 0 &&
      !this.state.closed &&
      acquisition &&
      acquisition.purchase_origin === 'money'
    ) {
      return <JustEnoughBalanceDialog onClose={this._onClose} />;
    }

    return null;
  };

  render() {
    return (
      <AltContainer
        stores={{
          authState: AuthStore,
          itemState: ItemStore,
        }}
        render={this._renderAlmostOutOfBalance}
      />
    );
  }
}

export default JustEnoughBalanceContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/JustEnoughBalanceContainer.js