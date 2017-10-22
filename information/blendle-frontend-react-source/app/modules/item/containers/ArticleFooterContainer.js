import React, { PureComponent } from 'react';
import { STATUS_OK } from 'app-constants';
import TilesStore from 'stores/TilesStore';
import ItemStore from 'stores/ItemStore';
import ArticleFooter from '../components/ArticleFooter';
import AltContainer from 'alt-container';

class ArticleFooterContainer extends PureComponent {
  // eslint-disable-next-line react/prop-types
  _renderArticleFooter = ({ tilesState, itemState }) => {
    const { tiles } = tilesState;
    const { selectedItemId, item, status } = itemState;
    const tile = tiles.get(selectedItemId);

    if (!tile || !item || status !== STATUS_OK) {
      return null;
    }

    return <ArticleFooter itemId={selectedItemId} />;
  };

  render() {
    return (
      <AltContainer
        render={this._renderArticleFooter}
        stores={{
          tilesState: TilesStore,
          itemState: ItemStore,
        }}
      />
    );
  }
}

export default ArticleFooterContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/ArticleFooterContainer.js