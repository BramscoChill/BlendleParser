import alt from 'instances/altInstance';
import axios from 'axios';
import Settings from 'controllers/settings';
import Analytics from 'instances/analytics';
import ItemActions from './ItemActions';
import { providerById, prefillSelector } from 'selectors/providers';
import { getManifestBody, getTitle } from 'helpers/manifest';

function getErrorCode(statusCode) {
  switch (statusCode) {
    case 202:
      return 'refund_account_limit';
    case 403:
      return 'refund_time_limit';
    case 429:
      return 'refund_rate_limit';
    default:
      return 'unable_to_refund';
  }
}

export default alt.createActions({
  toggleRefundDialog: () => true,

  resetState: () => true,

  setReason: x => x || null,

  setPossibleReasons(extraReason) {
    const reasons = [
      'accident',
      'price_high',
      'article_short',
      'article_long',
      'article_quality',
      'article_legability',
      'other',
    ];

    if (extraReason && !reasons.includes(extraReason)) {
      reasons.unshift(extraReason);
    }

    return reasons;
  },

  setMessage(message) {
    return message;
  },

  refundItem(item, user, reason, message) {
    axios
      .delete(Settings.getLink('user_item', { user_id: user.id, item_id: item.id }))
      .then((response) => {
        if (response.status === 200) {
          return Promise.resolve();
        }

        return Promise.reject(response);
      })
      .then(() =>
        axios.post(Settings.getLink('refund_reason', { user_id: user.id, item_id: item.id }), {
          refund_code: reason,
          refund_message: message,
        }),
      )
      .then(() => {
        const manifest = item._embedded['b:manifest'];
        const providerId = manifest.provider.id;
        const provider = prefillSelector(providerById)(providerId);

        this.refundItemSuccess({ itemId: item.id, userId: user.id });

        Analytics.track('Refund Item', {
          provider: provider.name,
          item_id: item.id,
          wordcount: manifest.length.words,
          issue_id: manifest.issue.id,
          item_title: getTitle(getManifestBody(manifest)),
          price: item.price / 100,
          reason: reason !== 'other' ? reason : message,
          referrer: document.referrer,
        });
      })
      .catch((err) => {
        this.refundItemError({ error: getErrorCode(err.status) });

        if (!err.status) {
          throw err;
        }
      });

    return item;
  },

  refundItemSuccess({ userId, itemId }) {
    ItemActions.clearReadingProgress({ userId, itemId });
    return { userId, itemId };
  },

  refundItemError: x => x,
});



// WEBPACK FOOTER //
// ./src/js/app/actions/RefundActions.js