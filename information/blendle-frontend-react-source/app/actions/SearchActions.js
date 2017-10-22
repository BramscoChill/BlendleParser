import alt from 'instances/altInstance';
import analytics from 'instances/analytics';
import * as SearchManager from 'managers/search';
import * as IssuesManager from 'managers/issue';
import { XHR_STATUS, STATUS_PENDING } from 'app-constants';
import BrowserEnv from 'instances/browser_environment';
import axios from 'axios';

class SearchActions {
  constructor() {
    this.generateActions(
      'fetchResultsError',
      'fetchNextResultsSuccess',
      'fetchNextResultsError',
      'setActive',
      'setInactive',
    );
  }

  /**
   * @param {String} keyword
   * @param {String} locale
   * @param {String} userId
   * @param {Object} [date=null]
   */
  fetchResults(keyword, locale, userId, date = null) {
    // http://www.ex-parrot.com/pete/upside-down-ternet.html
    if (keyword === 'upsidedownternet' && !BrowserEnv.hasTouch()) {
      document.body.style.transform = 'rotate(180deg)';
    }

    // https://xkcd.com/806
    if ((keyword || '').toLowerCase() === 'shibboleet') {
      window.location = 'mailto:jelmer@blendle.com?subject=Found%20a%20bug';
    }

    return (dispatch) => {
      const query = { keyword, locale, date };

      dispatch({ query });
      analytics.track('Search', { query: keyword.toLowerCase() });

      Promise.all([
        IssuesManager.fetchFavoriteIssues(userId),
        SearchManager.fetchItems(keyword, locale, date),
        SearchManager.fetchProvidersIssue(keyword, locale, 6),
      ])
        .then(([favs, items, issues]) => this.fetchResultsSuccess(query, favs, issues, items))
        .catch((error) => {
          if (error.type === XHR_STATUS) {
            return this.fetchResultsError({ query, error });
          }
          throw error;
        });
    };
  }

  fetchResultsSuccess(query, favs, issues, items) {
    if (issues.length) {
      const favoritesProviderIds = favs.map(fav => fav.provider_id);
      issues.forEach((issue) => {
        const issueProviderId = issue.get('provider').id;
        issue.set('favourite', favoritesProviderIds.includes(issueProviderId));
      });
    }

    return { query, issues, items };
  }

  fetchNextResults(next) {
    axios
      .get(next, {
        headers: {
          accept: 'application/hal+json',
          'X-Tile-Version': 3, // Use new tile endpoint version
        },
      })
      .then(res =>
        this.fetchNextResultsSuccess({
          items: {
            tiles: res.data._embedded['b:tiles'],
            next: res.data._links.next ? res.data._links.next.href : null,
          },
        }),
      )
      .catch((error) => {
        if (error.type === STATUS_PENDING) {
          return;
        }
        if (error.type === XHR_STATUS) {
          this.fetchNextResultsError({ error });
          return;
        }
        throw error;
      });

    return null;
  }
}

export default alt.createActions(SearchActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/SearchActions.js