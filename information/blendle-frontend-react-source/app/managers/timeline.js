import Settings from 'controllers/settings';
import moment from 'moment';
import uri from 'urijs';
import Country from 'instances/country';
import { translate, getCountryCode } from 'instances/i18n';
import axios from 'axios';
import { getException } from 'helpers/countryExceptions';
import { get } from 'lodash';
import AuthStore from 'stores/AuthStore';

const tilesZoomKeys = ['b:tiles'];

function getTrendingTypeTime(type) {
  const now = moment();
  switch (type) {
    case 'now':
      return now.subtract(1, 'h');
    case 'today':
      return now.subtract(24, 'h');
    case 'week':
      return now.subtract(7, 'd');
    default:
      return null;
  }
}

function trendingNowLabel() {
  const hours = new Date().getHours();
  if (hours >= 3 && hours < 12) {
    return translate('timeline.trending.morning');
  }
  if (hours >= 18) {
    return translate('timeline.trending.evening');
  }
  return translate('timeline.trending.afternoon');
}

export default {
  fetchTilesByUrl(url) {
    return axios
      .get(url, {
        headers: {
          accept: 'application/hal+json',
          'X-Tile-Version': 3, // Use new tile endpoint version
        },
      })
      .then(res => ({
        tiles: get(res, 'data._embedded[b:tiles]', []),
        next: get(res, 'data._links.next.href', null),
      }));
  },

  fetchPins(userId) {
    return this.fetchTilesByUrl(
      Settings.getLink(
        'user_pin_tiles',
        {
          user_id: userId,
        },
        tilesZoomKeys,
      ),
    );
  },

  fetchFollowing(userId) {
    return this.fetchTilesByUrl(
      Settings.getLink(
        'user_following_tiles',
        {
          user_id: userId,
          user_context: userId,
        },
        tilesZoomKeys,
      ),
    );
  },

  fetchUser(userId) {
    return this.fetchTilesByUrl(
      Settings.getLink(
        'user_posted_tiles',
        {
          user_context: userId,
          user_id: userId,
        },
        tilesZoomKeys,
      ),
    );
  },

  fetchSingleTile(itemId) {
    const userId = AuthStore.getState().user.id;
    const url = Settings.getLink('user_item_tile', { user_id: userId, item_id: itemId });

    return axios
      .get(url, {
        headers: {
          accept: 'application/hal+json',
          'X-Tile-Version': 3, // Use new tile endpoint version
        },
      })
      .then(response => response.data);
  },

  // TODO remove exception when backend implements new tile endpoint for userarchive
  _fetchTiles(url) {
    return axios
      .get(url)
      .then(response => ({
        itemIds: get(response, 'data._embedded.items', []).map(item => item.id),
        next: get(response, 'data._links.next.href', null),
      }))
      .then(({ itemIds, next }) =>
        Promise.all(itemIds.map(itemId => this.fetchSingleTile(itemId))).then(tiles => ({
          tiles,
          next,
        })),
      );
  },

  // TODO remove exception when backend implements new tile endpoint for userarchive
  fetchUserArchive(userId) {
    const url = Settings.getLink(
      'user_items',
      {
        user_id: userId,
      },
      ['b:item'],
    );

    return this._fetchTiles(url);
  },

  // TODO remove exception when backend implements new tile endpoint for userarchive
  fetchNextUserArchive(next) {
    return this._fetchTiles(next);
  },

  fetchChannel(userId, channelId) {
    return this.fetchTilesByUrl(
      Settings.getLink(
        'user_posted_tiles',
        {
          user_context: userId,
          user_id: channelId,
        },
        tilesZoomKeys,
      ),
    );
  },

  fetchTrending(userId, trendingType) {
    const baseUrl = Settings.getLink(
      'user_trending_tiles',
      {
        user_id: userId,
        user_context: userId,
      },
      tilesZoomKeys,
    );

    const fromTime = getTrendingTypeTime(trendingType);
    const url = uri(baseUrl).addSearch({
      from: fromTime ? fromTime.toISOString() : null,
      type: fromTime ? null : trendingType,
      version: 2,
    });

    return this.fetchTilesByUrl(url.toString());
  },

  fetchBundle(userId) {
    const baseUrl = Settings.getLink(
      'user_premium_tiles',
      {
        user_id: userId,
        user_context: userId,
      },
      tilesZoomKeys,
    );

    const url = uri(baseUrl);

    return axios
      .get(url.toString(), {
        headers: {
          accept: 'application/hal+json',
          'X-Tile-Version': 3,
        },
      })
      .then(resp => resp.data);
  },

  fetchSocialTrending(context) {
    const baseUrl = Settings.getLink('social_trending', { context });
    const url = uri(baseUrl).addSearch(String(Date.now()));

    return axios
      .get(url.toString(), {
        headers: {
          accept: 'application/hal+json',
        },
      })
      .then(resp => resp.data);
  },

  /**
   * we want to show a trending timeline based on the user's last activity
   * @param {User} user
   * @returns {String} filter
   */
  getUserTrendingFilter(user) {
    const now = moment();
    const lastVisit = moment(user.get('trending_viewed_at'));

    if (!Country.isBetaCountry(user.get('country')) && lastVisit.isAfter(now.subtract(1, 'h'))) {
      return 'now';
    }

    if (lastVisit.isAfter(now.subtract(24, 'h'))) {
      return 'today';
    }
    return 'week';
  },

  getTrendingFilters() {
    const hiddenTimelines = getException('hiddenTrendingTimelines', []);
    const items = [
      { label: translate('timeline.trending.now', [trendingNowLabel()]), trending: 'now' },
      { label: translate('timeline.trending.today'), trending: 'today' },
      { label: translate('timeline.trending.week'), trending: 'week' },
      { label: translate('timeline.trending.international'), trending: 'international' },
      { label: translate('timeline.trending.dutch'), trending: 'dutch', countryCode: 'NL' },
      { label: translate('timeline.trending.german'), trending: 'german', countryCode: 'DE' },
      { label: translate('timeline.trending.belgian'), trending: 'belgian', countryCode: 'BE' },
    ];

    return items.filter(
      option =>
        ((Country.isBetaCountry(option.countryCode) && Country.isBetaCountry()) ||
          (!Country.isBetaCountry(option.countryCode) && !Country.isBetaCountry())) &&
        !hiddenTimelines.includes(option.trending),
    );
  },
};



// WEBPACK FOOTER //
// ./src/js/app/managers/timeline.js