import alt from 'instances/altInstance';
import { isDev } from 'helpers/environment';
import { XHR_STATUS, XHR_TIMEOUT, XHR_ERROR } from 'app-constants';
import TypedError from 'helpers/typederror';
import axios from 'axios';

const MAX_NUMBER_OF_TRIES = 20;

function getUrlBase() {
  return isDev() ? 'https://article-to-speech.blendle.io' : 'https://article-to-speech.blendle.com';
}

const requestOptions = {
  headers: {
    Accept: 'audio/mpeg',
    'X-No-Location': 1,
  },

  validateStatus(status) {
    return [202, 303].includes(status);
  },
};

function fetchAudioUrl(itemId) {
  return new Promise((resolve, reject) => {
    const urlBase = getUrlBase();
    const requestUrl = `${urlBase}/recording/v1/${itemId}`;

    let fetchAttemptCount = 0;
    const fetchAttempt = () =>
      axios
        .head(requestUrl, requestOptions)
        .then((resp) => {
          if (resp.status === 202) {
            fetchAttemptCount += 1;

            if (fetchAttemptCount === MAX_NUMBER_OF_TRIES) {
              reject(
                new TypedError(
                  XHR_TIMEOUT,
                  `Audio file not ready after ${MAX_NUMBER_OF_TRIES} tries`,
                ),
              );
            }

            const retrySecondsTimeout = resp.headers['Retry-After'] || 1;
            setTimeout(fetchAttempt, retrySecondsTimeout * 1000);
          } else if (resp.status === 303) {
            resolve(resp.headers['x-location']);
          }
        })
        .catch(reject);

    fetchAttempt();
  });
}

class ItemToSpeechActions {
  fetchItemToSpeechUrl(itemId) {
    fetchAudioUrl(itemId)
      .then((url) => {
        this.itemToSpeechUrlSuccess({ itemId, url });
      })
      .catch((error) => {
        this.itemToSpeechUrlError({ itemId, error });

        if (![XHR_STATUS, XHR_TIMEOUT, XHR_ERROR].includes(error.type)) {
          throw error;
        }
      });

    return { itemId };
  }

  toggleControls = ({ itemId, toggle }) => ({ itemId, toggle });

  itemToSpeechUrlSuccess = ({ itemId, url }) => ({
    itemId,
    url,
  });

  itemToSpeechUrlError = ({ itemId, error }) => ({
    itemId,
    error,
  });
}

export default alt.createActions(ItemToSpeechActions);



// WEBPACK FOOTER //
// ./src/js/app/actions/ItemToSpeechActions.js