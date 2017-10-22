import { debounce } from 'lodash';
import Environment from 'environment';
import md5 from 'md5';
import Cookies from 'cookies-js';
import URI from 'urijs';

// Edited code from TradeTracker documentation
// https://sc.tradetracker.net/implementation/overview?f%5Blimit%5D=25&f%5Btarget%5D=merchant&f%5Bname%5D=General&f%5Bversion%5D=All&f%5BversionInfo%5D=General+conversion+script&cid=25192&pid=36948&tgi=

const TRADE_TRACKER_VISIT_COOKIE = 'TT_VISITOR';

window.ttConversionOptions = [];

const TradeTracker = {
  _trackConversion: (ttConversionOptions) => {
    /* eslint-disable */
    const campaignID =
      'campaignID' in ttConversionOptions
        ? ttConversionOptions.campaignID
        : 'length' in ttConversionOptions && ttConversionOptions.length
          ? ttConversionOptions[0].campaignID
          : null;
    const tt = document.createElement('script');
    tt.type = 'text/javascript';
    tt.async = true;
    tt.src = '//tm.tradetracker.net/conversion?s=' + encodeURIComponent(campaignID) + '&t=m';
    let s = document.getElementsByTagName('script');
    s = s[s.length - 1];
    s.parentNode.insertBefore(tt, s);
    /* eslint-enable */
  },

  /**
   * Get the TradeTracker param from a url search string
   * @param  {String}           search Full search string, like window.location.search
   * @return {undefined|String}        Either the current TradeTracker param or undefined
   */
  getTradeTrackerParam: search => URI.parseQuery(search).tt,

  /**
   * Parse the 'tt' search params
   * @param  {String} ttSearch 'tt' url search parameter
   * @return {Object}          Object with TradeTracker names as keys
   */
  getParams: (ttSearch) => {
    const params = {};

    const ttParams = ttSearch.split('_');

    params.campaignID = ttParams[0] || '';
    params.materialID = ttParams[1] || '';
    params.affiliateID = ttParams[2] || '';
    params.reference = ttParams[3] || '';

    return params;
  },

  /**
   * Get a TradeTracker md5 checksum based on the provided params
   * @param  {Object} params TradeTracker params
   * @return {String}        TradeTracker md5 checksum
   */
  getChecksum: params =>
    md5(
      `CHK_${params.campaignID}::${params.materialID}::${params.affiliateID}::${params.reference}`,
    ),

  /**
   * Get TradeTracker tracking data string based on params and checksum
   * @param  {Object} params   TradeTracker params
   * @param  {String} checksum TradeTracker md5 checksum
   * @return {String}          TradeTracker tracking data string
   */
  getTrackingData: (params, checksum) => {
    const time = Math.round(Date.now() / 1000);

    return [params.materialID, params.affiliateID, params.reference, checksum, time].join('::');
  },

  /**
   * Store the tracking data in the correct cookies
   * @param {String} campaignID   TradeTracker campaign id
   * @param {String} trackingData TradeTracker tracking data string
   */
  setCookies: (campaignID, trackingData) => {
    // When a visitor from TradeTracker signs up within a week, we need to send the lead to
    // TradeTracker
    Cookies.set(TRADE_TRACKER_VISIT_COOKIE, true, {
      path: '/',
      domain: '.blendle.com',
      expires: 60 * 60 * 24 * 7, // One week
    });

    // Set regular cookie used by TradeTracker
    Cookies.set(`TT2_${campaignID}`, trackingData, {
      path: '/',
      domain: '.blendle.com',
      expires: 60 * 60 * 24 * 365, // One year
    });

    // Set session cookie used by TradeTracker
    // No `expires` means session cookie: https://github.com/js-cookie/js-cookie#expires
    Cookies.set(`TTS_${campaignID}`, trackingData, {
      path: '/',
      domain: '.blendle.com',
    });
  },

  /**
   * Get TradeTracker trackback url
   * @param  {Object} params      TradeTracker params
   * @param  {String} redirectUrl The redirect url that should be opened after going to TradeTracker
   * @return {String}             TradeTracker trackback url
   */
  getTrackBackUrl: (params, redirectUrl) => {
    const { campaignID, materialID, affiliateID, reference } = params;
    const encodedReference = encodeURIComponent(reference);
    const encodedUrl = encodeURIComponent(redirectUrl);

    // eslint-disable-next-line max-len
    return `http://tc.tradetracker.net/?c=${campaignID}&m=${materialID}&a=${affiliateID}&r=${encodedReference}&u=${encodedUrl}`;
  },

  /**
   * Open the TradeTracker trackback url. This method is mainly added to test the unit
   * @param  {String} trackbackUrl TradeTracker trackback url
   */
  openTrackBack: (trackbackUrl) => {
    window.location = trackbackUrl;
  },

  /**
   * Redirect a TradeTracker visitor to the trackback url after setting the correct cookie
   * @param  {String} ttSearch 'tt' url search parameter
   */
  redirectTrackBack: (ttSearch, redirectPathname) => {
    const params = TradeTracker.getParams(ttSearch);
    const checksum = TradeTracker.getChecksum(params);
    const trackingData = TradeTracker.getTrackingData(params, checksum);

    TradeTracker.setCookies(params.campaignID, trackingData);

    const redirectUrl = ['local', 'development'].includes(Environment.name)
      ? `https://development.blendle.com${redirectPathname}`
      : `https://blendle.com${redirectPathname}`;
    const trackBackUrl = TradeTracker.getTrackBackUrl(params, redirectUrl);

    TradeTracker.openTrackBack(trackBackUrl);
  },

  shouldTrackLead: () => !!Cookies.get(TRADE_TRACKER_VISIT_COOKIE),

  /**
   * Track when someone gets a trial via TradeTracker
   * @param  {String}  transactionID Blendle tracking_uid
   */
  trackLead: debounce(
    (transactionID) => {
      const conversionOptions = {
        type: 'lead',
        campaignID: '25192',
        productID: '36948',
        transactionID,
        email: '',
        descrMerchant: 'Blendle',
        descrAffiliate: 'Blendle',
      };

      window.ttConversionOptions.push(conversionOptions);
      TradeTracker._trackConversion(conversionOptions);
    },
    { wait: 0, leading: false },
  ),
};

export default TradeTracker;



// WEBPACK FOOTER //
// ./src/js/app/instances/tradetracker.js