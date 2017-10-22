import Environment from 'environment';
import Auth from 'controllers/auth';
import uuid from 'node-uuid';

const GoogleAnalytics = {
  googleAnalyticsRequested: false,

  init(trackerId) {
    // init google analytics
    // copied from google's documentation
    window.ga =
      window.ga ||
      ((...args) => {
        window.ga.q = window.ga.q || [];
        window.ga.q.push(args);
      });
    window.ga.l = +new Date();

    window.ga('create', trackerId, 'auto');
    window.ga('set', 'anonymizeIp', true);
    window.ga('require', 'ecommerce');

    return this;
  },

  setUTMParameters(utmTags) {
    // Our own events use different names than Google does, so we need to map them
    const utmCouples = [
      {
        blendleName: 'referrer',
        googleName: 'referrer',
      },
      {
        blendleName: 'campaign',
        googleName: 'campaignName',
      },
      {
        blendleName: 'source',
        googleName: 'campaignSource',
      },
      {
        blendleName: 'medium',
        googleName: 'campaignMedium',
      },
      {
        blendleName: 'content',
        googleName: 'campaignContent',
      },
    ];

    utmCouples.forEach((utmCouple) => {
      // Only set the tags that are actually provided
      if (utmTags[utmCouple.blendleName]) {
        window.ga('set', utmCouple.googleName, utmTags[utmCouple.blendleName]);
      }
    });
  },

  set(fieldName, fieldValue) {
    window.ga('set', fieldName, fieldValue);
  },

  send(event, ...values) {
    this._loadGoogleAnalyticsIfNeeded();
    window.ga('send', event, ...values);
  },

  _loadGoogleAnalyticsIfNeeded() {
    if (!this.googleAnalyticsRequested) {
      if (Environment.name === 'local' || Environment.name === 'test') {
        console.info(
          // eslint-disable-line no-console
          '%cGoogleAnalytics Loaded',
          'color: #02a; padding: 3px; display: block; background: #9af; font-size: 90%;',
          'Started to load `analytics.js`',
        );
      }
      this._loadGoogleAnalytics();
    }
  },

  _loadGoogleAnalytics() {
    const scriptElement = document.createElement('script');
    scriptElement.async = 1;
    scriptElement.src = 'https://www.google-analytics.com/analytics.js';
    const otherScripts = document.getElementsByTagName('script')[0];
    otherScripts.parentNode.insertBefore(scriptElement, otherScripts);

    this.googleAnalyticsRequested = true;
  },

  _logEvent(type, ...values) {
    if (Environment.name === 'local' || Environment.name === 'test') {
      console.log(
        // eslint-disable-line no-console
        `%cGoogleAnalytics ${type}`,
        'color: #02a; padding: 3px; display: block; background: #9af; font-size: 90%;',
        ...values,
      );
    }
  },

  _isOptOut() {
    const user = Auth.getUser();
    if (user) {
      return user.get('mixpanel_opt_out');
    }
    return false;
  },

  trackPageView(url) {
    this._logEvent('PageView', 'tracked page view to', url);
    if (this._isOptOut()) {
      this._logEvent('User is opt out', 'Not going to track.');
      return;
    }

    this.set('page', url);
    this.send('pageview');
  },

  trackEvent(category, action, label, value) {
    this._logEvent('Event', category, action, label, value);
    if (this._isOptOut()) {
      this._logEvent('User is opt out', 'Not going to track.');
      return;
    }
    this.send('event', category, action, label, value);
  },

  sendPremiumSignupTransaction(transactionId = uuid.v4()) {
    window.ga('ecommerce:addTransaction', {
      id: transactionId,
      revenue: '0',
    });

    window.ga('ecommerce:addItem', {
      id: transactionId,
      name: 'Blendle Premium trial',
      price: '0',
      quantity: '1',
    });

    window.ga('ecommerce:send');
  },
};

export default GoogleAnalytics.init(Environment.gaTrackingId);



// WEBPACK FOOTER //
// ./src/js/app/instances/google_analytics.js