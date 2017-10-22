import { PLAY_STORE_URL } from 'app-constants';

const isAndroid = window.BrowserDetect.device === 'Android';
const isIOs = window.BrowserDetect.iOS;

export const platformHasApp = () => isAndroid || isIOs;

export const getAppItemUrl = itemId => `blendle://item/${itemId}`;

export const openItemInAndroid = (itemId) => {
  const openInAppWindow = window.open(getAppItemUrl(itemId), '_blank');
  setTimeout(() => {
    if (openInAppWindow) {
      openInAppWindow.location = PLAY_STORE_URL;
    }
  }, 500);
};



// WEBPACK FOOTER //
// ./src/js/app/helpers/openApp.js