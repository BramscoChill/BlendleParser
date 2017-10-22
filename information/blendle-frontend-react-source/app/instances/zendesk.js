import LibLoader from 'helpers/libloader';
import windowOpen from 'helpers/windowOpen';

function zendeskMockEmbed() {
  /*eslint-disable */
  const logger = msg => (...args) => console.log(`Zendesk ${msg}`, ...args);
  /*eslint-enable */

  window.zEmbed = window.zE = Object.assign(resolve => resolve(), {
    activate: () => windowOpen({ src: '' }),
    show: logger('visible'),
    hide: logger('hidden'),
    identify: logger('identify'),
    setLocale: logger('setLocale'),
    setHelpCenterSuggestions: logger('setHelpCenterSuggestions'),
  });
}

function embedZendesk() {
  if (process.env.BUILD_ENV === 'test') {
    zendeskMockEmbed();
    return;
  }

  // default embed code provided by Zendesk
  /* eslint-disable */
  window.zEmbed ||
    (function(e, t) {
      let n,
        o,
        d,
        i,
        s,
        a = [],
        r = document.createElement('iframe');
      (window.zEmbed = function() {
        a.push(arguments);
      }),
        (window.zE = window.zE || window.zEmbed),
        (r.src = 'javascript:false'),
        (r.title = ''),
        (r.role = 'presentation'),
        ((r.frameElement || r).style.cssText = 'display: none'),
        (d = document.getElementsByTagName('script')),
        (d = d[d.length - 1]),
        d.parentNode.insertBefore(r, d),
        (i = r.contentWindow),
        (s = i.document);
      try {
        o = s;
      } catch (e) {
        (n = document.domain),
          (r.src = 'javascript:var d=document.open();d.domain="' + n + '";void(0);'),
          (o = s);
      }
      (o.open()._l = function() {
        const o = this.createElement('script');
        n && (this.domain = n),
          (o.id = 'js-iframe-async'),
          (o.src = e),
          (this.t = +new Date()),
          (this.zendeskHost = t),
          (this.zEQueue = a),
          this.body.appendChild(o);
      }),
        o.write('<body onload="document._l();">'),
        o.close();
    })('https://assets.zendesk.com/embeddable_framework/main.js', 'blendle.zendesk.com');
  /* eslint-enable */
}

class Zendesk extends LibLoader {
  load() {
    return {
      then(cb) {
        if (!this._loaded) {
          // the embed code provided by zendesk injects the lib, and creates an 'onReady' function.
          embedZendesk();
          this._loaded = true;
        }
        window.zE(cb);
      },
    };
  }
}

export default new Zendesk(null, () => window.zE);



// WEBPACK FOOTER //
// ./src/js/app/instances/zendesk.js