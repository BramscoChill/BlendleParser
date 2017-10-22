import LibLoader from 'helpers/libloader';
import windowOpen from 'helpers/windowOpen';
import { sprintf } from 'sprintf-js';
import Environment from 'environment';

const library =
  Environment.name === 'test'
    ? 'http://localhost:3000/static/scripts/twitter-js-stub.js'
    : '//platform.twitter.com/widgets.js';

const Twitter = new LibLoader(library, () => window.twttr);

const shareUrl =
  Environment.name === 'test' ? '' : 'https://twitter.com/intent/tweet?url=%(url)s&text=%(text)s';

Object.assign(Twitter, {
  shareUrl,

  /**
   * opens the Twitter share popup.
   * @param {String} text
   * @param {String} url
   */
  openTweet(text, url = '') {
    const src = sprintf(this.shareUrl, {
      url: encodeURIComponent(url),
      text: encodeURIComponent(text),
    });

    return windowOpen({
      src,
      name: 'intent',
      width: 550,
      height: 420,
    });
  },
});

export default Twitter;



// WEBPACK FOOTER //
// ./src/js/app/instances/twitter.js