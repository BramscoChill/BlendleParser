import axios from 'axios';
import alt from 'instances/altInstance';
import Settings from 'controllers/settings';
import { STATUS_INITIAL } from 'app-constants';
import BundlesActions from 'actions/BundlesActions';
import { validTiles } from 'selectors/tiles';
import { hasAccessToPremiumFeatures } from 'helpers/premiumEligibility';
import { param } from 'helpers/url';

const linkOptions = {
  zoom: ['b:tiles'],
  amount: 5,
};

const requestHeaders = {
  accept: 'application/hal+json',
  'X-Tile-Version': 3,
};

function getTrendingTilesUrl(userId, endpointName, queryOptions) {
  return Settings.getLink(
    endpointName,
    {
      user_id: userId,
    },
    {
      ...linkOptions,
      ...queryOptions,
    },
  ).toString();
}

const getMltUrl = item => `${item._links.mlt.href}?${param(linkOptions)}`;

export default alt.createActions({
  fetchTrendingTiles(userId, itemId) {
    const trendingTilesUrl = getTrendingTilesUrl(userId, 'items_popular', {
      user: userId,
      ...linkOptions,
    });

    axios
      .get(trendingTilesUrl, {
        headers: requestHeaders,
      })
      .then(resp =>
        this.fetchSuggestionTilesSuccess({
          tiles: validTiles(resp.data._embedded['b:tiles']),
          suggestionType: 'trending',
          itemId,
        }),
      )
      .catch((err) => {
        if (err.status !== 404) {
          throw err;
        }
      });

    return itemId;
  },

  fetchRelatedTiles(item) {
    const url = getMltUrl(item);
    axios
      .get(url, {
        headers: requestHeaders,
      })
      .then(resp =>
        this.fetchSuggestionTilesSuccess({
          tiles: validTiles(resp.data._embedded['b:tiles']),
          suggestionType: 'related',
          itemId: item.id,
        }),
      );

    return item.id;
  },

  fetchRelatedTilesSuccess: x => x,
  fetchSuggestionTilesSuccess: x => x,

  fetchBundleTiles(user, bundleState = {}) {
    if (!hasAccessToPremiumFeatures(user)) {
      return null;
    }

    // Only fetch the bundle if we don't already have it
    if (bundleState.status === STATUS_INITIAL) {
      BundlesActions.fetchBundle(user.id);
    }

    return user.id;
  },
});



// WEBPACK FOOTER //
// ./src/js/app/actions/TrendingSuggestionsActions.js