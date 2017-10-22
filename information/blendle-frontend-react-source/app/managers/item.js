import axios from 'axios';
import Settings from 'controllers/settings';

const PARAGRAPHS_READ_QUOTIENT_KEY = 'paragraph_progress';

function fetchLink(link) {
  return axios
    .get(link, { headers: { accept: 'application/hal+json' } })
    .then(response => response.data);
}

export function fetchContent(itemId) {
  const link = Settings.getLink('item_content', { item_id: itemId });

  return fetchLink(link);
}

export function acquireItem(userId, itemId, socialOrigin) {
  const link = Settings.getLink('user_items', { user_id: userId });
  const body = { id: itemId };

  if (socialOrigin) {
    body.social_origin = socialOrigin;
  }

  return axios
    .post(link, body, {
      headers: { accept: 'application/hal+json' },
    })
    .then(response => response.data);
}

const getReadingProgressLink = (userId, itemId) =>
  Settings.getLink('user_item_paragraph_progress', {
    user_id: userId,
    item_id: itemId,
  });

export function storeReadingProgress(paragraphsReadQuotient, { userId, itemId }) {
  return axios.put(getReadingProgressLink(userId, itemId), {
    [PARAGRAPHS_READ_QUOTIENT_KEY]: paragraphsReadQuotient,
  });
}

export function clearReadingProgress({ userId, itemId }) {
  return axios.delete(getReadingProgressLink(userId, itemId));
}

export function fetchReadingProgress({ userId, itemId }) {
  return axios
    .get(getReadingProgressLink(userId, itemId))
    .then((resp) => {
      const result = resp.data[PARAGRAPHS_READ_QUOTIENT_KEY];
      if (result > 1) {
        throw new Error(
          `${PARAGRAPHS_READ_QUOTIENT_KEY} is more than one, expected a number between 0 and 1`,
        );
      }

      return result;
    })
    .catch((err) => {
      if (err.status === 404) {
        return NaN; // Always return typeof number
      }

      throw err;
    });
}



// WEBPACK FOOTER //
// ./src/js/app/managers/item.js