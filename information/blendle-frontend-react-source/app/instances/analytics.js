import _ from 'lodash';
import GoogleAdwords from 'instances/googleadwords';
import GoogleAnalytics from 'instances/google_analytics';
import ByeBye from 'byebye';
import BlendAlytics from 'instances/blendalytics';
import Environment from 'environment';
import { providerById, prefillSelector } from 'selectors/providers';
import { getManifestBody, getTitle } from 'helpers/manifest';
import getExperimentsStatsPayload from 'helpers/getExperimentsStatsPayload';
import moment from 'moment';
import stripTags from 'underscore.string/stripTags';
import { getFeaturedImage } from 'selectors/manifest';
import { getTrackingURL } from 'helpers/url';

const Analytics = {
  _utm: {},
  _user: null,

  _outputToConsole(eventName, properties) {
    if (Environment.name === 'local' || Environment.name === 'test') {
      console.log(
        '%cAnalytics', // jshint ignore:line
        'color: #0a0; padding: 3px; display: block; background: #beb; font-size: 90%;',
        eventName,
        properties,
      );
    }
  },

  /**
   * users can disable tracking
   * @returns {boolean} allowed
   */
  _allowTracking() {
    return !this._user || (this._user && !this._user.get('mixpanel_opt_out'));
  },

  /**
   * Override track event to add additional properties
   * @param {String} eventName
   * @param {Object} trackProps properties to track
   */
  track(eventName, trackProps = {}) {
    if (!this._allowTracking()) {
      return;
    }

    const props = Analytics.setDefaultProperties(trackProps);
    Analytics._outputToConsole(eventName, props);
    BlendAlytics.track(eventName, props);
  },

  setDefaultProperties(properties) {
    const session = {
      session: this._session,
    };

    const client_timestamp = {
      client_timestamp: moment().format(),
    };

    if (this._user) {
      session.tracking_uid = this._user.get('tracking_uid');

      // Some logged in users don't have a tracking_uid and we're trying to fix the issue
      if (!session.tracking_uid) {
        window.Raven.captureMessage('Logged in user without tracking_uid', {
          extra: {
            tracking_uid: _.get(this._user, 'attributes.tracking_uid'),
          },
        });
      }
    }

    return {
      ...properties,
      ...Analytics._utm,
      ...Analytics._origin,
      ...Analytics.getHistory(),
      ...session,
      ...getExperimentsStatsPayload(),
      ...client_timestamp,
    };
  },

  getHistory() {
    const history = {
      current_uri: getTrackingURL(window.location),
    };

    if (document.referrer) {
      history.referrer = document.referrer;
    }

    if (ByeBye.history.getPrevious()) {
      history.previous_uri = getTrackingURL(ByeBye.history.getPreviousAsObject());
    }

    return history;
  },

  urlChange() {
    if (!this._allowTracking()) {
      return;
    }

    const properties = Analytics.setDefaultProperties();
    this._outputToConsole('URL Change', properties);
    BlendAlytics.track('URL Change', properties);
  },

  setSession(session) {
    this._session = session;
    return BlendAlytics.setSession(session);
  },

  signup(user, payload = {}) {
    const platform = user.get('facebook_id') ? 'facebook' : 'blendle';
    this.setUser(user);
    this.track('Signup/Successful', {
      platform,
      ...payload,
    });
  },

  setUser(user) {
    this._user = user;
  },

  setOrigin(country, locale) {
    Analytics._origin = { country, locale };
  },

  setUTMParameters(utmParams) {
    Analytics._utm = utmParams;
  },

  trackUserPremiumSignup(transactionId) {
    // Trigger a GoogleAdword signup conversion.
    GoogleAdwords.conversion('signup');
    GoogleAnalytics.sendPremiumSignupTransaction(transactionId);
  },

  trackPerformance(props) {
    if (!this._allowTracking()) {
      return;
    }
    BlendAlytics.track('Performance', props);
  },

  /**
   * Track an open item to analytics
   *
   * @param {Object} item the item to track
   * @param {Object} options   event options
   * @param {String} eventName the event name to log (default: Open Item)
   */
  trackItemEvent(item, options, eventName) {
    const payload = {};

    if (!eventName || typeof eventName === 'object') {
      eventName = 'Open Item';
    }

    if (item.get) {
      const manifest = item.getEmbedded('manifest');
      const acquisition = item.getEmbedded('b:acquisition');

      const byline = _.find(manifest.get('body'), { type: 'byline' });

      let fullIssueAcquired = null;
      if (acquisition.getEmbedded('b:issue-acquisition')) {
        fullIssueAcquired = acquisition.getEmbedded('b:issue-acquisition').get('acquired');
      }

      const manifestBody = getManifestBody(manifest);

      payload.provider = prefillSelector(providerById)(manifest.get('provider').id).name;
      payload.item_id = item.id;
      payload.item_title = getTitle(manifestBody);
      payload.issue = manifest.get('issue').id;
      payload.acquired = acquisition.get('acquired');
      payload.price = acquisition.get('price');
      payload.revenue = parseInt(acquisition.get('price'), 10) * 100; // price in cents
      payload.subscription = acquisition.get('subscription');
      payload.full_issue = fullIssueAcquired;
      payload.wordcount = manifest.get('length').words;
      payload.byline = byline ? stripTags(byline.content) : null;
      payload.transaction_id = acquisition.get('transaction_id');
      payload.has_featured_image = !!getFeaturedImage(manifest);
    } else {
      const manifest = item._embedded['b:manifest'] || item._embedded.manifest;
      const manifestBody = getManifestBody(manifest);
      const byline = _.find(manifest.body, { type: 'byline' });

      payload.provider = prefillSelector(providerById)(manifest.provider.id).name;
      payload.item_id = manifest.id;
      payload.item_title = getTitle(manifestBody);
      payload.issue = manifest.issue.id;
      payload.acquired = item.item_purchased;
      payload.price = String(item.price / 100);
      payload.revenue = item.price; // price in cents
      payload.subscription = this._user
        .get('active_subscriptions')
        .some(providerUid => providerUid === manifest.provider.id);
      payload.full_issue = item.issue_purchased;
      payload.wordcount = manifest.length.words;
      payload.byline = byline ? stripTags(byline.content) : null;
      payload.has_featured_image = !!getFeaturedImage(manifest);
    }

    this.track(eventName, _.extend(options || {}, payload));
  },
};

export default Analytics;



// WEBPACK FOOTER //
// ./src/js/app/instances/analytics.js