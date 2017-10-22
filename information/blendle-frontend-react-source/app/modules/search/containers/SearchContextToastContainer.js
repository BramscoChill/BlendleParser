import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Altcontainer from 'alt-container';
import TilesStore from '../../../stores/TilesStore';
import SearchContextToast from 'modules/search/components/SearchContextToast';
import { getDate } from 'selectors/tiles';
import { getSnippet, getTerm } from 'selectors/searchContext';

class SearchContextToastContainer extends PureComponent {
  static propTypes = {
    itemId: PropTypes.string.isRequired,
  };

  _renderSearchContext = ({ tilesState }) => {
    const { tiles } = tilesState;
    const { itemId } = this.props;

    return (
      <SearchContextToast
        term={getTerm(tiles, itemId)}
        snippet={getSnippet(tiles, itemId)}
        date={getDate(tiles, itemId)}
      />
    );
  };

  render() {
    return <Altcontainer stores={{ tilesState: TilesStore }} render={this._renderSearchContext} />;
  }
}

export default SearchContextToastContainer;



// WEBPACK FOOTER //
// ./src/js/app/modules/search/containers/SearchContextToastContainer.js