import { decode } from './base64';

export default function parseJWT(JWT) {
  return JSON.parse(decode(JWT.split('.')[1]));
}



// WEBPACK FOOTER //
// ./src/js/app/helpers/parseJWT.js