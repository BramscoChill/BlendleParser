import React, { PureComponent } from 'react';
import { truncate } from 'lodash';
import AltContainer from 'alt-container';
import SelectedShare from '../components/SelectedShare';
import ShareActions from 'actions/ShareActions';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import { getManifest } from 'selectors/tiles';
import TilesStore from 'stores/TilesStore';

const analytics = {
  internal_location: 'selected_text',
};

function getActiveItemManifest() {
  const { selectedItemId } = ItemStore.getState();
  const { tiles } = TilesStore.getState();

  return getManifest(tiles, selectedItemId);
}

function getShareMessage(platform, selectedText) {
  let trimmedText = selectedText.trim();
  if (platform === 'twitter') {
    // Truncate the text so there's room for the link and the quote marks
    trimmedText = truncate(trimmedText, { length: 114 });
  }

  return `"${trimmedText}"`;
}

export default ComposedComponent =>
  class WithSelectedTextShare extends PureComponent {
    _onSocialShare = (platform, selectedText) => {
      const manifest = getActiveItemManifest();
      const { user } = AuthStore.getState();

      ShareActions.shareItemToPlatform(platform, manifest, analytics, user, {
        shareMessage: getShareMessage(platform, selectedText),
      });
    };

    // eslint-disable-next-line react/prop-types
    _renderSelectedShare = itemState => (
      <SelectedShare
        onSocialShare={this._onSocialShare}
        itemScrollY={itemState.scrollPixelsFromTop}
        selectedItemId={itemState.selectedItemId}
        analytics={analytics}
      >
        <ComposedComponent {...this.props} />
      </SelectedShare>
    );

    render() {
      return <AltContainer store={ItemStore} render={this._renderSelectedShare} />;
    }
  };



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withSelectedTextShare.js