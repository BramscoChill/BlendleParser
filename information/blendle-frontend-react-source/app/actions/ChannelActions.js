import alt from 'instances/altInstance';
import SessionActions from 'actions/SessionActions';
import Auth from 'controllers/auth';
import * as ChannelManager from 'managers/channel';
import Analytics from 'instances/analytics';
import googleAnalytics from 'instances/google_analytics';
import { shouldTrackGAClickEvent } from 'helpers/premiumOnboardingEvents';
import { XHR_STATUS } from 'app-constants';

class ChannelActions {
  constructor() {
    this.generateActions(
      'fetchChannelsSuccess',
      'fetchChannelsError',
      'fetchChannelDetailsSuccess',
      'fetchChannelDetailsError',
    );
  }

  fetchChannels() {
    ChannelManager.fetchChannels().then((channels) => {
      this.fetchChannelsSuccess({ data: channels });
    });

    return null;
  }

  fetchChannelDetails(channelId) {
    return (dispatch) => {
      dispatch({ channelId });
      ChannelManager.fetchChannel(channelId)
        .then((channel) => {
          this.fetchChannelDetailsSuccess({
            channelId,
            data: channel,
          });
        })
        .catch((err) => {
          if (err.type === XHR_STATUS && err.status === 404) {
            return this.fetchChannelDetailsError({ channelId });
          }
          throw err;
        });
    };
  }

  followChannel(userId, channelId, isFollowing, analyticsPayload = {}) {
    return (dispatch) => {
      dispatch({ userId, channelId, isFollowing });
      const { pathname } = window.location;
      if (isFollowing) {
        ChannelManager.follow(Auth.getUser(), [{ id: channelId }]);
        Analytics.track('Channel Subscribe', { channel: channelId, ...analyticsPayload });
        if (shouldTrackGAClickEvent(pathname)) {
          googleAnalytics.trackEvent(pathname, 'select', channelId);
        }
      } else {
        ChannelManager.unfollow(Auth.getUser(), [{ id: channelId }]);
        Analytics.track('Channel Unsubscribe', { channel: channelId, ...analyticsPayload });
        if (shouldTrackGAClickEvent(pathname)) {
          googleAnalytics.trackEvent(pathname, 'deselect', channelId);
        }
      }

      SessionActions.setItem('didUpdatePreferences', true);
    };
  }
}

export default alt.createActions(ChannelActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ChannelActions.js