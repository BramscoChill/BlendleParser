const ByeBye = require('byebye');
const BrowserEnv = require('instances/browser_environment');
const Cookies = require('cookies-js');
const i18n = require('instances/i18n').locale;

const isAndroidNativeBrowser = BrowserDetect.browser === 'Android Browser';

const UpgradeBrowserBarView = ByeBye.View.extend({
  className: 'v-upgrade-browser',

  events: {
    'click input': '_closeOverlay',
  },

  updateUrls: {
    default: 'https://www.google.com/chrome',
    firefox: 'https://www.mozilla.org/firefox/new',
    safari: 'http://apple.com/safari',
    opera: 'http://opera.com',
  },

  _textKey: 'message',

  initialize() {
    document.body.classList.add('s-upgrade-browser');

    if (BrowserEnv.isMobile() && !isAndroidNativeBrowser) {
      this._textKey = 'intro';
      this.el.addEventListener('click', this._toggleText.bind(this));
    }
  },

  isClosed() {
    return Cookies.get('deprecated_browser');
  },

  render() {
    this.el.className = [this.className, this._textKey].join(' ');
    let html = i18n.app.deprecated_browser.bar[this._textKey];

    const updateUrl = this.updateUrls[window.BrowserDetect.browser.toLowerCase()];
    html = html.replace('{updateUrl}', updateUrl || this.updateUrls.default);

    this.el.innerHTML = `<p>${html}</p>`;

    if (isAndroidNativeBrowser) {
      const button = document.createElement('input');
      button.type = 'button';
      button.className = 'btn';
      button.value = i18n.deprecated_browser.close;
      this.el.appendChild(button);
    }

    return this;
  },

  _toggleText() {
    this._textKey = this._textKey === 'intro' ? 'message' : 'intro';
    this.render();
  },

  _closeOverlay(ev) {
    Cookies.set('deprecated_browser', 'hi', { expires: 60 * 60 * 24 });
    this.el.parentNode.removeChild(this.el);
  },
});

module.exports = UpgradeBrowserBarView;



// WEBPACK FOOTER //
// ./src/js/app/views/upgradebrowserbar.js