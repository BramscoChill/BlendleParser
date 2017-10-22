import { flowRight, kebabCase, deburr, trim } from 'lodash';

const replace = (find, replacement) => str => str.replace(find, replacement);
const reduceSpaces = replace(/[ ]{2,}/g, ' ');
const atSignToText = replace(/@/g, ' at ');
const stripUnicode = replace(/[^\w\d\-]/g, '');

export default flowRight(stripUnicode, kebabCase, reduceSpaces, deburr, trim, atSignToText);



// WEBPACK FOOTER //
// ./src/js/app/helpers/slugify.js