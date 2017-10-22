import URI from 'urijs';

// the following host names are receiving the Authorization header
const whiteListedAuthHosts = [
  'ws.blendle.com',
  'ws-no-zoom.blendle.com',
  'ws.blendle.nl',
  'subscription.blendle.com',
  'article-to-speech.blendle.com',
];

if (process.env.BUILD_ENV !== 'production') {
  whiteListedAuthHosts.push(
    'ws-development.blendle.com',
    'ws-development-no-zoom.blendle.com',
    'ws-approval.blendle.com',
    'ws-approval-no-zoom.blendle.com',
    'blendle-subscription-staging.blendle.io',
    'blendle-subscription-development.blendle.io',
    'blendle-subscription-vodafone.blendle.io',
    'ws-vodafone.blendle.io',
    'ws-vodafone-no-zoom.blendle.io',
    'vodafone.blendle.io',
    'article-to-speech.blendle.io',
  );
}

/**
 * set the Authorization header to make JWT calls
 * @param requestConfig
 * @returns {*}
 */
export default function (requestConfig) {
  if (!requestConfig.url) {
    return requestConfig;
  }

  const auth = require('controllers/auth');
  const token = auth.getToken();
  const authorizeUrl = whiteListedAuthHosts.includes(URI(requestConfig.url).host());

  if (token && authorizeUrl && !('Authorization' in requestConfig.headers)) {
    requestConfig.headers.Authorization = `Bearer ${token.get('jwt')}`;
  }
  return requestConfig;
}



// WEBPACK FOOTER //
// ./src/js/app/http/interceptors/request/setAuthorizationHeader.js