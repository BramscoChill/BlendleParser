import { getItem, setItem } from 'helpers/localStorage';
const uuid = require('node-uuid');
const Cookies = require('cookies-js');

function generateUuid() {
  return uuid.v4();
}

function getCookieUuid() {
  return Cookies.get('uuid');
}

function saveUuid(value) {
  setItem('uuid', value);

  Cookies.set('uuid', value, {
    domain: '.blendle.com',
  });
  return value;
}

function getUuid() {
  const curLocal = getItem('uuid');
  const curCookie = getCookieUuid();

  if (curLocal && curCookie) {
    return saveUuid(curLocal);
  }

  if (curLocal || curCookie) {
    return saveUuid(curLocal || curCookie);
  }

  return saveUuid(generateUuid());
}

export default getUuid;



// WEBPACK FOOTER //
// ./src/js/app/helpers/uuid.js