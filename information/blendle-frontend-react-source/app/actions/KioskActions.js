import alt from 'instances/altInstance';
import _ from 'lodash';
import Settings from 'controllers/settings';
import { XHR_STATUS, XHR_ABORT, STATUS_PENDING } from 'app-constants';
import KioskManager from 'managers/kiosk';
import IssuesManager from 'managers/issue';
import IssuesCollection from 'collections/issues';
import Collection from 'libs/byebye/collection';

function fetchIssues(issuesUrl, userId) {
  const issues = new IssuesCollection();

  return Promise.all([
    IssuesManager.fetchFavoriteIssues(userId),
    issues.fetch({ url: issuesUrl, accept: 'application/hal+json' }),
  ]).then(([favourites]) => {
    const favoritesProviderIds = favourites.map(fav => fav.provider_id);
    issues.forEach((issue) => {
      const issueProviderId = issue.get('provider').id;
      issue.set('favourite', favoritesProviderIds.indexOf(issueProviderId) > -1);
    });

    return issues;
  });
}

class KioskActions {
  constructor() {
    this.generateActions(
      'fetchNewsStandSuccess',
      'fetchNewsStandError',
      'fetchCategorySuccess',
      'fetchCategoryError',
      'fetchAcquiredIssuesSuccess',
      'fetchAcquiredIssuesError',
      'fetchNextAcquiredIssuesSuccess',
      'fetchNextAcquiredIssuesError',
    );
  }

  setInactive() {
    return { active: false };
  }

  setActive() {
    return { active: true };
  }

  fetchAcquiredIssues(userId) {
    return (dispatch) => {
      dispatch({ categoryId: 'my-issues' });

      const issuesUrl = Settings.getLink('user_issues', { user_id: userId });

      fetchIssues(issuesUrl, userId)
        .then((issues) => {
          this.fetchAcquiredIssuesSuccess({ issues });
        })
        .catch((err) => {
          if (err.type === XHR_STATUS) {
            return this.fetchAcquiredIssuesError({ message: err.message });
          }
          throw err;
        });
    };
  }

  fetchNextAcquiredIssues(collection) {
    return (dispatch) => {
      if (!(collection instanceof Collection) || !collection.hasNext() || collection.isFetching()) {
        return;
      }

      dispatch({ categoryId: 'my-issues' });

      collection
        .fetchNext()
        .then(() => {
          this.fetchNextAcquiredIssuesSuccess({
            issues: collection,
          });
        })
        .catch((err) => {
          if (err.type === STATUS_PENDING) {
            return;
          }
          if (err.type === XHR_STATUS) {
            this.fetchNextAcquiredIssuesError({ err });
            return;
          }
          throw err;
        });
    };
  }

  /**
   * Fetch the newsStand (if empty) and the category
   * @param {Object|Null} newsStand
   * @param {String} categoryId
   * @param {String} userId
   */
  fetchKiosk(newsStand, categoryId, userId) {
    return (dispatch) => {
      dispatch();

      let newsStandPromise;
      if (!newsStand) {
        // todo: just use fetchNewsStand actions
        newsStandPromise = KioskManager.getNewsStand(userId)
          .then((newsStand) => {
            this.fetchNewsStandSuccess({ newsStand });
            return newsStand;
          })
          .catch((err) => {
            if (err.type === XHR_STATUS) {
              return this.fetchNewsStandError({ message: err.message });
            }
            throw err;
          });
      } else {
        newsStandPromise = Promise.resolve(newsStand);
      }

      newsStandPromise.then((newsStand) => {
        this.fetchCategory(newsStand, categoryId, userId);
      });
    };
  }

  /**
   * The newsStand contains which kiosk categories we need to show for a user.
   * @param {String} userId
   */
  fetchNewsStand(userId) {
    return (dispatch) => {
      dispatch();

      return KioskManager.getNewsStand(userId)
        .then((newsStand) => {
          this.fetchNewsStandSuccess({ newsStand });
          return newsStand;
        })
        .catch((err) => {
          if (err.type === XHR_STATUS) {
            return this.fetchNewsStandError({ message: err.message });
          }
          throw err;
        });
    };
  }

  fetchCountryKiosk(country) {
    KioskManager.getCountryNewsStand(country).then((links) => {
      const kiosk = {};
      const queue = links.categories.map((category) => {
        const collection = new IssuesCollection();
        kiosk[category.id] = collection;

        return collection.fetch({ url: category.href }).catch(() => Promise.resolve());
      });

      Promise.all(queue).then(() => this.fetchCountryKioskSuccess({ kiosk }));
    });

    return null;
  }

  fetchCountryKioskSuccess({ kiosk }) {
    return { kiosk };
  }

  /**
   * A kiosk category is a combination of the Issues and Favourites resource,
   * and contains all the issues of the given category, with a flag if the user has starred it.
   * @param {Object} newsStand
   * @param {String} categoryId
   * @param {String} userId
   */
  fetchCategory(newsStand, categoryId, userId) {
    return (dispatch) => {
      // search for the link in the categories object, or finally in the top level.
      // this is because the popular resource isn't a category, but a static endpoint
      const link = _.find(newsStand.categories, { id: categoryId }) || newsStand[categoryId];

      if (!link) {
        this.fetchCategoryError({ message: 'ID not found' });
      } else {
        dispatch({ categoryId });
      }

      const issuesUrl = link.href.replace('{user_id}', userId);

      fetchIssues(issuesUrl, userId)
        .then((issues) => {
          this.fetchCategorySuccess({ categoryId, issues });
        })
        .catch((err) => {
          // @TODO make sure the RequestManager throws XHR_* typed errors
          if (err.type === XHR_ABORT) {
            return;
          } else if (err.type === XHR_STATUS) {
            this.fetchCategoryError({ categoryId, message: err.message });
          }
          throw err;
        });
    };
  }

  rememberScrollPosition(position) {
    return { position };
  }
}

export default alt.createActions(KioskActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/KioskActions.js