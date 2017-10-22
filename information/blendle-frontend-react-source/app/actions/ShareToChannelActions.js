import alt from 'instances/altInstance';
import SharingManager from 'managers/sharing';
import { XHR_STATUS } from 'app-constants';
import Analytics from 'instances/analytics';
import ShareActions from 'actions/ShareActions';

class ShareToChannelActions {
  shareToChannel({ channel, itemId, message, userId, publicationTime }) {
    return SharingManager.shareToChannel({ channel, itemId, message, publicationTime }).then(
      (data) => {
        const channelId = data._embedded.user.id;
        this.shareToChannelSuccess({ userId, channelId, itemId });
      },
      (error) => {
        this.shareToChannelError({ error });

        if (error.type !== XHR_STATUS) {
          throw error;
        }

        return error;
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  shareToChannelSuccess({ channelId, userId, itemId }) {
    ShareActions.fetchItemPosts(userId, itemId);

    Analytics.track('Channels: Post Item', {
      channel: channelId,
      poster: userId,
    });

    return null;
  }

  shareToChannelError = x => x;
}

export default alt.createActions(ShareToChannelActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ShareToChannelActions.js