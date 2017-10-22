import { get } from 'lodash';
import URI from 'urijs';

export function expandTemplate(template, values) {
  return URI.expand(template, values).toString();
}

export function getLink(object, key, values) {
  return expandTemplate(get(object, ['_links', key, 'href']), values);
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/hal.js