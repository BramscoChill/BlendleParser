import URI from 'urijs';

const urls = [
  { domain: 'facebook.com', label: 'Facebook' },
  { domain: 't.co', label: 'Twitter' },
  { domain: 'twitter.com', label: 'Twitter' },
  { domain: 'linkedin.com', label: 'LinkedIn' },
  { domain: 'xing.com', label: 'XING' },
  { domain: 'xing-news.com', label: 'XING' },
];

export default function getUrlSiteName(url) {
  const domain = new URI(url).domain();
  const found = urls.find(entry => entry.domain === domain);
  return found ? found.label : null;
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/getUrlSiteName.js