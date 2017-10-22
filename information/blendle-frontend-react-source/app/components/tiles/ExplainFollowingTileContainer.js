import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AltContainer from 'alt-container';
import ExplainFollowingTile from 'components/tiles/ExplainFollowingTile';
import TwitterStore from 'stores/TwitterStore';
import FacebookStore from 'stores/FacebookStore';

class ExplainFollowingTileContainer extends PureComponent {
  static propTypes = {
    onHide: PropTypes.func.isRequired,
  };

  _renderExplainFollowingTile = ({ twitterState, facebookState }) => (
    <ExplainFollowingTile
      twitterConnected={twitterState.connected}
      facebookConnected={facebookState.connected}
      onHide={this.props.onHide}
    />
  );

  render() {
    return (
      <AltContainer
        stores={{ twitterState: TwitterStore, facebookState: FacebookStore }}
        render={this._renderExplainFollowingTile}
      />
    );
  }
}

export default ExplainFollowingTileContainer;



// WEBPACK FOOTER //
// ./src/js/app/components/tiles/ExplainFollowingTileContainer.js