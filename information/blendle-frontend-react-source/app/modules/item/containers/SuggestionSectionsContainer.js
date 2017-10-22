import { compose, branch } from 'recompose';
import renderNothingIfIsHidden from 'higher-order-components/renderNothingIfIsHidden';
import renderNothingIfLoading from 'higher-order-components/renderNothingIfLoading';
import { getItemFromTiles } from 'selectors/tiles';
import { hasBundle } from 'selectors/user';
import { isBundleItem } from 'selectors/item';
import altConnect from 'higher-order-components/altConnect';
import AuthStore from 'stores/AuthStore';
import TilesStore from 'stores/TilesStore';
import withBundleSuggestions from '../higher-order-components/withBundleSuggestions';
import withTrendingRelatedSuggestions from '../higher-order-components/withTrendingRelatedSuggestions';
import SuggestionSections from '../components/SuggestionSections';

const shouldShowBundleSuggestions = (tile, user) => tile && isBundleItem(tile) && hasBundle(user);

function mapStateToProps({ tilesState, authState }, { itemId }) {
  const { user } = authState;
  const tile = getItemFromTiles(itemId, tilesState);

  return {
    itemId,
    isHidden: !tile,
    isBundleSuggestion: shouldShowBundleSuggestions(tile, user),
  };
}

mapStateToProps.stores = { TilesStore, AuthStore };

const enhance = compose(
  altConnect(mapStateToProps),
  renderNothingIfIsHidden,
  branch(
    ({ isBundleSuggestion }) => isBundleSuggestion,
    withBundleSuggestions,
    withTrendingRelatedSuggestions,
  ),
  renderNothingIfLoading,
);

export default enhance(SuggestionSections);



// WEBPACK FOOTER //
// ./src/js/app/modules/item/containers/SuggestionSectionsContainer.js