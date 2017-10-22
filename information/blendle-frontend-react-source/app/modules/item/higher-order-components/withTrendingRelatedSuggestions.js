import { compose, lifecycle } from 'recompose';
import TrendingSuggestionsActions from 'actions/TrendingSuggestionsActions';
import { STATUS_PENDING, STATUS_INITIAL } from 'app-constants';
import { translate } from 'instances/i18n';
import AuthStore from 'stores/AuthStore';
import ItemStore from 'stores/ItemStore';
import { MOBILE_LAYOUT_SCROLLING } from 'modules/sectionsPage/constants';
import TrendingSuggestionsStore from 'stores/TrendingSuggestionsStore';
import altConnect from 'higher-order-components/altConnect';
import { SUGGESTION_SECTION_RELATED, SUGGESTION_SECTION_TRENDING } from '../constants';

const LOADING_STATUSES = [STATUS_PENDING, STATUS_INITIAL];
const isLoading = status => LOADING_STATUSES.includes(status);

function mapStateToProps({ trendingSuggestionsState, authState }, { itemId }) {
  const { user } = authState;
  const {
    trendingStatus = STATUS_INITIAL,
    relatedStatus = STATUS_INITIAL,
    trendingTileIds = [],
    relatedTileIds = [],
  } =
    trendingSuggestionsState[itemId] || {};

  return {
    itemId,
    userId: user.id,
    trendingStatus,
    relatedStatus,
    sections: [
      {
        label: `${translate('item.text.trending')} ${translate('item.text.articles')}`,
        type: SUGGESTION_SECTION_RELATED,
        itemIds: trendingTileIds,
        mobileLayout: MOBILE_LAYOUT_SCROLLING,
        isLoading: isLoading(trendingStatus),
      },
      {
        label: `${translate('item.text.related')} ${translate('item.text.articles')}`,
        type: SUGGESTION_SECTION_TRENDING,
        itemIds: relatedTileIds,
        mobileLayout: MOBILE_LAYOUT_SCROLLING,
        isLoading: isLoading(relatedStatus),
      },
    ],
  };
}

mapStateToProps.stores = { TrendingSuggestionsStore, AuthStore };

const actions = {
  fetchTrendingTiles: TrendingSuggestionsActions.fetchTrendingTiles,
  fetchRelatedTiles: () => {
    const { item } = ItemStore.getState();

    TrendingSuggestionsActions.fetchRelatedTiles.defer(item);
  },
};

const withTrendingRelatedSuggestions = compose(
  altConnect(mapStateToProps, actions),
  lifecycle({
    componentDidMount() {
      const {
        trendingStatus,
        relatedStatus,
        itemId,
        userId,
        fetchTrendingTiles,
        fetchRelatedTiles,
      } = this.props;

      if (!trendingStatus) {
        fetchTrendingTiles.defer(userId, itemId);
      }

      if (!relatedStatus) {
        fetchRelatedTiles(itemId);
      }
    },
  }),
);

export default withTrendingRelatedSuggestions;



// WEBPACK FOOTER //
// ./src/js/app/modules/item/higher-order-components/withTrendingRelatedSuggestions.js