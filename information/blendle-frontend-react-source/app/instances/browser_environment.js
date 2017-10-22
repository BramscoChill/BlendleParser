const BrowserDetect = window.BrowserDetect;
const DocumentTouch = window.DocumentTouch;

const winWidth = window.innerWidth;
const winHeight = window.innerHeight;

const hasTouch =
  ('ontouchstart' in window || (DocumentTouch && window.document instanceof DocumentTouch)) &&
  !window.navigator.userAgent.match(/phantomjs-no-touch/i);

const isDeprecated = (() => {
  const fake = window.localStorage ? window.localStorage.getItem('fake_deprecated_browser') : false;
  const oldSafari = BrowserDetect.browser === 'Safari' && BrowserDetect.version < 9;
  const oldFirefox = BrowserDetect.browser === 'Firefox' && BrowserDetect.version < 36;
  return fake || oldSafari || oldFirefox;
})();

const isMobileUA = /android|blackberry|ipod|mobile|phone|tizen|webos/i.test(navigator.userAgent);
const isPhoneSized = Math.min(winWidth, winHeight) < 550;
const isPhone = Boolean(isMobileUA && isPhoneSized);

export default {
  hasTouch: () => hasTouch,
  isMobile: () => isPhone,
  isDesktop: () => !isPhone,
  isDeprecated: () => isDeprecated,
  isIPad: () => BrowserDetect.device === 'iPad',
  isAndroidBrowser: () => BrowserDetect.browser === 'Android Browser',
  getOrientation: () => (winWidth > winHeight ? 'landscape' : 'portrait'),
};



// WEBPACK FOOTER //
// ./src/js/app/instances/browser_environment.js