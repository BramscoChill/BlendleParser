import { get, unescape } from 'lodash';
import moment from 'moment';
import alt from 'instances/altInstance';
import windowOpen from 'helpers/windowOpen';
import { translate } from 'instances/i18n';
import Facebook from 'instances/facebook';
import Twitter from 'instances/twitter';
import Analytics from 'instances/analytics';
import SharingManager from 'managers/sharing';
import TileActions from 'actions/TileActions';
import { getContentAsText, getTitle, getManifestBody, getIntro } from 'helpers/manifest';
import { history } from 'byebye';
import { providerById, prefillSelector } from 'selectors/providers';
import { getItem, setItem } from 'helpers/localStorage';
import { createItemUri } from 'helpers/prettyurl';
import { LINKEDIN_LINK, XHR_STATUS } from 'app-constants';
import { sprintf } from 'sprintf-js';
import { getFeaturedImage } from 'selectors/manifest';
import { getHash } from 'helpers/sharerHash';

import { getManifest } from 'selectors/tiles';
import TilesStore from 'stores/TilesStore';

function trackEvent(eventName, itemId) {
  const { tiles } = TilesStore.getState();
  const manifest = getManifest(tiles, itemId);

  Analytics.track(eventName, {
    platform: 'blendle',
    provider: manifest.provider.id,
    item_id: itemId,
    item_title: getTitle(getManifestBody(manifest)),
  });
}

/**
 * Navigates to /social if /social was not dismissed before or dismiss took place 3 months ago
 */
function showSocialDialogue() {
  const lastShownUnix = parseInt(getItem('socialDialogueShown'), 10);

  if (isNaN(lastShownUnix) || moment().diff(moment.unix(lastShownUnix), 'months') > 2) {
    setItem('socialDialogueShown', moment().unix());
    history.navigate('/social', { trigger: true });
  }
}

function getShareItemUrl(userId, manifest, refererCode, utmData = {}) {
  const utm = Object.keys(utmData)
    .map(utmKey => `${encodeURIComponent(utmKey)}=${encodeURIComponent(utmData[utmKey])}`)
    .join('&');

  return [
    window.location.protocol,
    '//',
    window.location.host,
    '/',
    createItemUri(manifest),
    '/r/',
    refererCode,
    '?',
    utm,
    `&sharer=${encodeURIComponent(getHash(userId, manifest.id))}`,
  ].join('');
}

class ShareActions {
  constructor() {
    this.generateActions(
      'shareItemToEmailSuccess',
      'shareItemToEmailError',
      'loadPlatform',
      'loadPlatformSuccess',
      'resetStatus',
    );
  }

  loadPlatforms() {
    this.loadPlatform('twitter');
    this.loadPlatform('facebook');

    Twitter.load()
      .then(() => this.loadPlatformSuccess('twitter'))
      .catch(() => null);

    Facebook.load()
      .then(() => this.loadPlatformSuccess('facebook'))
      .catch(() => null);

    return null;
  }

  shareItemToPlatform(platform, manifest, analytics, user, extraOptions) {
    if (platform === 'twitter') {
      return this.shareItemToTwitter(manifest, user, analytics, extraOptions);
    }

    if (platform === 'facebook') {
      return this.shareItemToFacebook(manifest, user, analytics, extraOptions);
    }

    if (platform === 'linkedin') {
      return this.shareItemToLinkedIn(manifest, user, analytics, extraOptions);
    }

    if (platform === 'whatsapp') {
      return this.shareItemToWhatsApp(manifest, user, analytics, extraOptions);
    }

    return null;
  }

  shareItemToFacebook(manifest, user, analytics = {}) {
    const date = moment(manifest.date);

    // Medium size should always be available if there are images
    const featuredImage = getFeaturedImage(manifest);
    let picture;
    if (featuredImage) {
      picture = get(featuredImage, '_links.medium.href');
    }

    const url = getShareItemUrl(user.id, manifest, 'sh-fb', {
      medium: 'facebook',
      campaign: 'social-share',
      source: 'blendle',
    });
    const provider = prefillSelector(providerById)(manifest.provider.id);

    const manifestBody = getManifestBody(manifest);
    Facebook.lib.ui(
      {
        method: 'feed',
        display: 'popup',
        name: getContentAsText(getTitle(manifestBody)),
        caption: sprintf('Blendle: %s %s', provider.name, date.format('L')),
        description: getContentAsText(getIntro(manifestBody)),
        link: url,
        picture,
      },
      (response) => {
        if (response && response.post_id && !user.get('facebook_id')) {
          showSocialDialogue();
        }
      },
    );

    Analytics.track('Start Social Share Item', {
      ...analytics,
      platform: 'facebook',
    });

    return manifest;
  }

  shareItemToEmail(userId, manifest, to, message, analytics = {}) {
    SharingManager.shareToEmail(userId, manifest.id, to, message)
      .then(() => {
        Analytics.track('Share Email: Sent', {
          item_id: manifest.id,
          provider_id: manifest.provider.id,
          recipients_count: to.length,
          ...analytics,
        });

        this.shareItemToEmailSuccess(to);
      })
      .catch((error) => {
        this.shareItemToEmailError({ error });

        if (error.type !== XHR_STATUS) {
          throw error;
        }
      });

    return true;
  }

  shareItemToTwitter(manifest, user, analytics = {}, options = {}) {
    const url = getShareItemUrl(user.id, manifest, 'sh-tw', {
      medium: 'twitter',
      campaign: 'social-share',
      source: 'blendle',
    });

    const providerId = manifest.provider.id;
    const manifestBody = getManifestBody(manifest);
    const text =
      options.shareMessage ||
      translate('item.text.sharing.twitter', [
        prefillSelector(providerById)(providerId).name,
        getContentAsText(getTitle(manifestBody)),
      ]);

    const twitterWindow = Twitter.openTweet(unescape(text), url);

    if (!twitterWindow) {
      // Mobile doesn't do popups so window is undefined
      if (typeof user.get('twitter_id') !== 'string') {
        showSocialDialogue();
      }
    } else {
      const interval = setInterval(() => {
        if (twitterWindow.closed) {
          clearInterval(interval);
          if (typeof user.get('twitter_id') !== 'string') {
            showSocialDialogue();
          }
        }
      }, 500);
    }

    Analytics.track('Start Social Share Item', {
      ...analytics,
      platform: 'twitter',
    });

    return manifest;
  }

  shareToPocket(itemId) {
    return (dispatch) => {
      SharingManager.shareToPocket(itemId).then(() => dispatch({ itemId }));
    };
  }

  shareItemToLinkedIn(manifest, user, analytics = {}) {
    const providerId = manifest.provider.id;
    const manifestBody = getManifestBody(manifest);
    const providerName = prefillSelector(providerById)(providerId).name;
    const url = getShareItemUrl(user.id, manifest, 'sh-in', {
      medium: 'linkedin',
      campaign: 'social-share',
      source: 'blendle',
    });
    const linkedInUrl = sprintf(
      LINKEDIN_LINK,
      encodeURIComponent(url),
      encodeURIComponent(`${getContentAsText(getTitle(manifestBody))} (${providerName})`),
      encodeURIComponent(getContentAsText(getIntro(manifestBody))),
      'Blendle',
    );

    windowOpen({
      src: linkedInUrl,
      name: 'intent',
      width: 550,
      height: 542,
    });

    Analytics.track('Start Social Share Item', {
      ...analytics,
      platform: 'linkedin',
    });

    return manifest;
  }

  shareItemToWhatsApp(manifest, user, analytics = {}) {
    const url = getShareItemUrl(user.id, manifest, 'sh-wa', {
      medium: 'whatsapp',
      campaign: 'social-share',
      source: 'blendle',
    });

    const providerId = manifest.provider.id;
    const text = translate('item.text.sharing.general', [
      prefillSelector(providerById)(providerId).name,
      getContentAsText(getTitle(getManifestBody(manifest))),
      url,
    ]);
    const location = `whatsapp://send?text=${encodeURIComponent(unescape(text))}`;

    if (window.BrowserDetect.device === 'Android') {
      window.open(location, '_blank');
    } else {
      window.location = location;
    }

    Analytics.track('Start Social Share Item', {
      ...analytics,
      platform: 'whatsapp',
    });

    return manifest;
  }

  shareToFollowing(itemId, userId, text) {
    SharingManager.shareToFollowing(userId, itemId, text).then(() => {
      this.fetchItemPosts(userId, itemId);
      TileActions.fetchTile(userId, itemId);
      this.shareToFollowingSuccess({ itemId, userId, text });
    });

    trackEvent(text ? 'Add Text to Post' : 'Post Item', itemId);

    return null;
  }

  removeShareToFollowing(itemId, userId) {
    SharingManager.removeShareToFollowing(userId, itemId).then(() => {
      this.removeShareToFollowingSuccess(itemId, userId);
      this.fetchItemPosts(userId, itemId);
      TileActions.fetchTile(userId, itemId);
    });

    trackEvent('Delete Post', itemId);

    return null;
  }

  fetchItemPosts(userId, itemId) {
    SharingManager.fetchItemPosts(userId, itemId).then(
      this.fetchItemPostsSuccess,
      this.fetchItemPostsError,
    );

    return null;
  }

  fetchItemPostsSuccess = data => get(data, '_embedded[b:posts]', []);
  fetchItemPostsError = x => x;
  shareToFollowingSuccess = x => x;
  removeShareToFollowingSuccess = x => x;
  toggleCommentForm = toggle => toggle;
  setMessage = message => message;
}

export default alt.createActions(ShareActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ShareActions.js