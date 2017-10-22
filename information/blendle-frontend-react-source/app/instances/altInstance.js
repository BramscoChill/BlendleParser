import Alt from 'alt';
import Environment from 'environment';

const alt = new Alt();

if (Environment.name === 'local') {
  Alt.debug('alt', alt);
}

export default alt;



// WEBPACK FOOTER //
// ./src/js/app/instances/altInstance.js