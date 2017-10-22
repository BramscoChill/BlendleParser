import URI from 'urijs';
import { escape } from 'lodash';

export default function urlToLink(source) {
  return URI.withinString(source, (url) => {
    const uri = new URI(url);
    uri.normalize();

    if (!uri.protocol()) {
      uri.protocol('http');
    }

    return `
      <a href="${escape(uri)}" target="_blank" rel="noopener">
        ${escape(uri.readable())}
      </a>
    `;
  });
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/urlToLink.js