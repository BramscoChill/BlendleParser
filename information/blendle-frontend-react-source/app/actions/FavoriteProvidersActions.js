import { XHR_STATUS } from 'app-constants';
import SessionActions from 'actions/SessionActions';
import IssuesManager from 'managers/issue';
import ProviderManager from 'managers/provider';
import Analytics from 'instances/analytics';
import googleAnalytics from 'instances/google_analytics';
import alt from 'instances/altInstance';
import { providerById, prefillSelector } from 'selectors/providers';
import { shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';

class ProviderActions {
  constructor() {
    this.generateActions('fetchFavoriteProvidersSuccess', 'fetchFavoriteProvidersError');
  }

  fetchFavoriteProviders(userId) {
    return (dispatch) => {
      dispatch();

      return IssuesManager.fetchFavoriteIssues(userId)
        .then(favorites => favorites.map(favorite => favorite.provider_id))
        .then(favorites => this.fetchFavoriteProvidersSuccess({ favorites }))
        .catch((err) => {
          if (err.type === XHR_STATUS) {
            return this.fetchFavoriteProvidersError({ message: err.message });
          }
          throw err;
        });
    };
  }

  favoriteProvider(userId, providerId, toggle, analyticsPayload = {}) {
    ProviderManager.favorite(userId, providerId, toggle).then(() => {
      const eventName = toggle ? 'Add Favorite' : 'Remove Favorite';
      Analytics.track(eventName, { provider_id: providerId, ...analyticsPayload });
      const gaEventName = toggle ? 'select' : 'unselect';
      const { pathname } = window.location;
      if (shouldTrackGAClickEvent(pathname)) {
        googleAnalytics.trackEvent(pathname, gaEventName, providerId);
      }

      SessionActions.setItem('didUpdatePreferences', true);
    });

    return { providerId, toggle };
  }
}

export default alt.createActions(ProviderActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/FavoriteProvidersActions.js